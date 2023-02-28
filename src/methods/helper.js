import { Image } from "@napi-rs/canvas";

export function drawText(ctx, obj, offsetLeft, offsetTop) {
  let {
    transformX,
    transformY,
    angle,
    color,
    opacity,
    fontSize,
    fontStyle,
    fontWeight,
    fontFamily,
    underline,
    text,
    elemBoundingRect,
  } = obj;

  console.log(text);
  let x = transformX - offsetLeft + elemBoundingRect.width / 2;
  let y = transformY - offsetTop + elemBoundingRect.height / 2;
  let textX = transformX - offsetLeft + 16;
  let textY = transformY - offsetTop + elemBoundingRect.height - 18;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-x, -y);
  ctx.fillStyle = color;
  ctx.globalAlpha = Number(opacity);
  let str = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
  console.log(str);
  if (underline.includes("underline")) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = fontSize.match(/\d+/)[0] * 0.1;
    ctx.lineTo(textX, textY + 5);
    ctx.lineTo(textX + elemBoundingRect.width - 32, textY + 5);
    ctx.stroke();
    ctx.closePath();
  }
  ctx.font = str;
  ctx.fillText(text, textX, textY);
  ctx.restore();
  ctx.globalAlpha = 1;
  console.log("done with a text");
}

export async function drawImage(ctx, obj, offsetLeft, offsetTop) {
  let {
    transformX,
    transformY,
    angle,
    height,
    width,
    opacity,
    elemBoundingRect,
    img,
  } = obj;

  let x = transformX - offsetLeft + elemBoundingRect.width / 2;
  let y = transformY - offsetTop + elemBoundingRect.height / 2;
  let imgX = transformX - offsetLeft;
  let imgY = transformY - offsetTop + 35;
  let imgElement = new Image();
  let promise = new Promise((res) => {
    imgElement.onload = function () {
      console.log("image loaded", opacity, imgElement.complete);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.translate(-x, -y);
      ctx.globalAlpha = Number(opacity);
      ctx.drawImage(imgElement, imgX, imgY, width, height);
      ctx.restore();
      ctx.globalAlpha = 1;
      res("done");
    };
  });

  imgElement.src = new Buffer.from(
    img.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
    "base64"
  );

  return promise;
}
