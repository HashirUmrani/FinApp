// import arcjet, { tokenBucket } from "@arcjet/next";

// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   characteristics: ["userId"],
//   rules: [
//     tokenBucket({
//       mode: "LIVE",
//       refillRate: 10,
//       interval: 3600,
//       capacity: 10,
//     }),
//   ],
// });

// export default aj;

import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip"], // safer and guaranteed to work
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 3600,
      capacity: 10,
    }),
  ],
});

export default aj;
