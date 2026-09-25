import { Router } from "express";
import { issuesController } from "../controllers/issue.controller";
import { auth, authorizeRole } from "../../../utils/auth";

const router = Router();

router.post(
  "/",
  auth,
  authorizeRole("contributor", "maintainer"),
  issuesController.createIssue,
);
router.get("/", issuesController.getAllIssues);

router.get("/:id", issuesController.getSingleIssue);

router.patch(
  "/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  issuesController.updateIssue,
);

router.delete(
  "/:id",
  auth,
  authorizeRole("maintainer"),
  issuesController.deleteIssue,
);

export const issuesRoute = router;
