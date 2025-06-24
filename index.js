import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";

const resolvers = {
    Query: {
        games() {
            return db.games;
        }, 
        reviews() {
            return db.reviews;
        },
        authors() {
            return db.authors;
        },
        review(_, args) {
            return db.reviews.find(review => review.id === parseInt(args.id));
        },
        game(_, args) {
            return db.games.find(game => game.id === parseInt(args.id));
        },
        author(_, args) {
            return db.authors.find(author => author.id === parseInt(args.id));
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id);
        }
    },
    Review: {
        author(parent) {
            return db.authors.find(author => author.id === parent.author_id);
        },
        game(parent) {
            return db.games.find(game => game.id === parent.game_id);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers

});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);