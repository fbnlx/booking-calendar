import express = require("express");
import cors = require("cors");
import { graphqlHTTP } from "express-graphql";

const schema = require("./schema");

const PORT = process.env.port || 4000;

var app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(PORT, () =>
  console.log(
    `Running a GraphQL API server at http://localhost:${PORT}/graphql`
  )
);
