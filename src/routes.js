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
      const tasks = database.select("tasks");
      tasks.filter();
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
