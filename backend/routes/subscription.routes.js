import {Router} from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "GET all subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "GET subscription by ID" });
});
subscriptionRouter.post('/', (req, res) => {
    res.send({ title: 'CREATE new subscription'})
})
subscriptionRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE subscription by ID" });
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE subscription by ID" });
});

subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({ title: "GET all subscriptions for user" });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "CANCEL subscription by ID" });
});

subscriptionRouter.post("/upcoming-renewals", (req, res) => {
  res.send({ title: "GET all upcoming renewals" });
});
export default subscriptionRouter;