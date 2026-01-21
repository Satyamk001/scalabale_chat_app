const http = require("http");
const app = require("./app");
const { initSocket } = require("./utils/socket");
const { connectDB } = require("./config/dbConfig");
const { initKafka, consumeMessage } = require("./utils/kafka");

const initServer = async () => {
   try {
      await initKafka();
      await connectDB();
      await consumeMessage();
      const httpServer = http.createServer(app);
      initSocket(httpServer);
      httpServer.listen(process.env.PORT || 3000, () => {
         console.log(`Server is running on port ${process.env.PORT || 3000}`);
      });
   } catch (error) {
      console.log(error);
   }
}

initServer();

process.on('unhandledRejection', (reason, promise) => {
   console.log(reason, promise);
   process.exit(1);
});

