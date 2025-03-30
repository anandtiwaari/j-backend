// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "doyuooim8",
//   api_key: "671495197927166",
//   api_secret: "cZVyD3-wCiWLZ3fnm0miV_tKeeA",
// });

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: 'doyuooim8',
  api_key: '671495197927166',
  api_secret: 'cZVyD3-wCiWLZ3fnm0miV_tKeeA',
//   secure: true,
});


module.exports = cloudinary;
