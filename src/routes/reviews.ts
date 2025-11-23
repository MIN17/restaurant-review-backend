import { ReviewType, UpdateReviewType, DeleteReviewType } from "../schema";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { client } from "../db";

export default async function reviewRoutes(fastify: FastifyInstance) {
  // handle GET request for reviews
  fastify.get("/", async (req, res) => {
    try {
      const data = await client.query("SELECT * FROM reviews");
      res.send(data.rows);
    } catch (err) {
      console.log(`Error message: ${err}`);
      res.status(500);
    }
  });

  // handle POST request for adding a new review
  fastify.post<{ Body: ReviewType }>("/addReview", async (req, res) => {
    const { name, address, rating, review } = req.body;

    try {
      await client.query(
        `
        INSERT INTO reviews (name, address, rating, review)
        VALUES ($1, $2, $3, $4)
      `,
        [name, address, rating, review],
      );

      res.send("review inserted");
    } catch (err) {
      console.log(`Error message: ${err}`);
      res.status(500);
    }
  });

  // handle PUT request for updating a review
  fastify.put<{ Body: UpdateReviewType }>("/updateReview", async (req, res) => {
    const { id, rating, review } = req.body;

    if (id) {
      await client.query(
        `
        UPDATE reviews
        SET rating = $2, review = $3
        WHERE id = $1
        `,
        [id, rating, review],
      );
    }

    res.send("Reviews updated.");
  });

  // handle DELETE request for deleting the review
  fastify.delete<{ Body: DeleteReviewType }>(
    "/deleteReviews",
    async (req, res) => {
      const { id } = req.body;
      console.log(id);

      if (id) {
        await client.query(
          `
        DELETE FROM reviews WHERE id = $1
      `,
          [id],
        );
        // if no specific review is provided, delete ALL reviews
        // (This happens when DELETE ALL REVIEWS button is clicked)
      } else {
        await client.query(`
        DELETE FROM reviews
      `);
      }

      res.send("Reviews deleted");
    },
  );
}
