import { randomUUID } from "node:crypto";
import { buildRouteUrl } from "../utils/build-route-url.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    url: buildRouteUrl("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    url: buildRouteUrl("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    url: buildRouteUrl("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const [task] = database.select("tasks", { id });
      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title or description must be added" })
          );
      }
      if (!task) {
        return res
          .writeHead(404)
          .end(
            JSON.stringify({ message: "No tasks matching provided task ID" })
          );
      }
      database.update("tasks", id, {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    url: buildRouteUrl("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const [task] = database.select("tasks", { id });
      if (!task) {
        return res
          .writeHead(404)
          .end(
            JSON.stringify({ message: "No tasks matching provided task ID" })
          );
      }
      if (!!task.completed_at) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Task already completed" }));
      }
      database.update("tasks", id, {
        ...task,
        completed_at: new Date(),
        updated_at: new Date(),
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    url: buildRouteUrl("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
