const { graphql, buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

graphql({
  schema,
  source: "{ hello }",
  rootValue,
}).then((response) => {
  console.log(response);
});
