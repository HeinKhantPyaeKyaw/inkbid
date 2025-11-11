import os
import pandas as pd
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt
from services.pdf_handler import extract_text_from_pdf
from services.preprocess_text import preprocess_text
from services.models import load_vicuna, query_vicuna, query_szegedai
from services.normalize_results import normalize_vicuna, normalize_szegedai
from services.ensemble import ensemble_results

def load_texts_from_directory(base_path, folder_mapping=None):
    """
    Load texts from different AI model directories and human texts
    Returns a dictionary with labels and texts
    """
    datasets = {
        'human': [],
        'openai': [],
        'claude': [],
        'gemini': []
    }

    if folder_mapping is None:
        folder_mapping = {
            'Human': 'Human',
            'OpenAI': 'OpenAI',
            'Claude': 'Claude',
            'Gemini': 'Gemini'
        }

    for source_folder, target_label in folder_mapping.items():
        dir_path = os.path.join(base_path, source_folder)
        target_key = target_label.lower()
        if os.path.exists(dir_path):
            print(f"Processing directory: {dir_path}")
            for filename in os.listdir(dir_path):
                if filename.endswith('.pdf'):
                    file_path = os.path.join(dir_path, filename)
                    try:
                        text = extract_text_from_pdf(file_path)
                        clean_text = preprocess_text(text, lowercase=False,
                                                   remove_punctuation=False,
                                                   normalize_encoding=True)
                        datasets[target_key].append(clean_text)
                    except Exception as e:
                        print(f"Error processing {file_path}: {str(e)}")

    return datasets

def evaluate_text(text):
    """
    Evaluate a single text using the ensemble model
    Returns: True if AI-generated, False if human
    """
    vicuna_raw = query_vicuna(text)
    szegedAI_raw = query_szegedai(text)

    vicuna_result = normalize_vicuna(vicuna_raw)
    szegedAI_result = normalize_szegedai(szegedAI_raw)

    final_result = ensemble_results(vicuna_result, szegedAI_result)

    return not final_result["eligible"]

def create_confusion_matrix(y_true, y_pred, labels):
    """
    Create and save confusion matrix visualization
    """
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=labels, yticklabels=labels)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig('confusion_matrix.png')
    plt.close()

    return cm

def main():
    load_vicuna()

    print("Loading texts from directories...")
    base_path = "/Users/jeff/Desktop/InkBid/InkBId AI testing"
    folder_mapping = {
        'Human_version_pdf': 'Human',
        'OpenAI': 'OpenAI',
        'Claude': 'Claude',
        'Gemini': 'Gemini'
    }
    datasets = load_texts_from_directory(base_path, folder_mapping)
    y_true = []
    y_pred = []
    results_data = []

    for label, texts in datasets.items():
        print(f"Processing {label} texts...")
        for text in texts:
            true_label = label != 'human'
            predicted_label = evaluate_text(text)

            y_true.append(true_label)
            y_pred.append(predicted_label)

            results_data.append({
                'true_label': 'AI' if true_label else 'Human',
                'predicted_label': 'AI' if predicted_label else 'Human',
                'correct': true_label == predicted_label
            })

    labels = ['Human', 'AI']
    cm = create_confusion_matrix(y_true, y_pred, labels)

    report = classification_report(y_true, y_pred, target_names=labels)

    results_df = pd.DataFrame(results_data)

    print("\nConfusion Matrix:")
    print(cm)
    print("\nClassification Report:")
    print(report)
    print("\nResults Summary:")
    print(f"Total samples: {len(y_true)}")
    print(f"Accuracy: {(np.array(y_true) == np.array(y_pred)).mean():.2%}")

    # Save detailed results to CSV
    results_df.to_csv('model_evaluation_results.csv', index=False)
    print("\nResults have been saved to 'model_evaluation_results.csv'")
    print("Confusion matrix visualization has been saved to 'confusion_matrix.png'")

if __name__ == "__main__":
    main()
