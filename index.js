import express, { json } from "express";
import cors from "cors";
import { drawText, drawImage } from "./methods/helper.js";
import { createCanvas,GlobalFonts } from '@napi-rs/canvas';
import { Image } from '@napi-rs/canvas';



const app = express();
app.use(cors(
  {
    origin:["http://localhost:5173","https://water-stamp.vercel.app"]
  }
));
app.use(json({ limit: "50mb" }));

// registering fonts
GlobalFonts.registerFromPath("./assets/fonts/Chillax-Variable.ttf", "Chillax Variable");
GlobalFonts.registerFromPath("./assets/fonts/ClashGrotesk-Variable.ttf", "Clash Grotesk Variable");
GlobalFonts.registerFromPath("./assets/fonts/GeneralSans-Variable.ttf", "General Sans Variable");
GlobalFonts.registerFromPath("./assets/fonts/Satoshi-Variable.ttf", "Satoshi Variable");

const getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');
app.post("/image", (req, res) => {
 
  let canvas;
  let ctx;
  let body = req.body.params;
  let img = new Image();

  img.onload = async function () {
    canvas = createCanvas(img.width, img.height);
    ctx = canvas.getContext("2d");
    console.log("load completed");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.scale(body.scale, body.scale);
    for(let el of body.elements){
      el.type == "text"
      ? drawText(ctx, el.element, body.offsetLeft, body.offsetTop)
      : await drawImage(
          ctx,
          el.element,
          body.offsetLeft,
          body.offsetTop
        )
    }
  
    let data = canvas.toDataURL();

    res.send(JSON.stringify({data:data}));
  };

  img.src = new Buffer.from(body.img.replace(/^data:image\/(png|gif|jpeg);base64,/,''),"base64");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening");
});

