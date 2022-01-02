"use strict";function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,r):void 0}}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayLikeToArray(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,i=new Array(r);e<r;e++)i[e]=t[e];return i}module.exports={name:"Image",handler:function(){var w=this,m=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(l,r){var t=m.url,e=void 0===t?"":t,i=m.x,d=void 0===i?0:i,o=m.y,c=void 0===o?0:o,a=m.width,u=void 0===a?0:a,n=m.height,s=void 0===n?0:n,h=m.mode,y=void 0===h?"scaleToFill":h,g=m.radius,p=void 0===g?0:g,f=w.canvas.createImage();f.src=e,f.onload=function(){wx.getImageInfo({src:e,success:function(t){var r,e=t.width,i=t.height,o=u/s,a=1,n=1;"aspectFit"===y?(a=t.width/t.height<o?u/t.width*t.height/s:1,n=t.width/t.height>o?s/t.height*t.width/u:1):"aspectFill"===y&&(a=t.width/t.height>o?u/t.width*t.height/s:1,n=t.width/t.height<o?s/t.height*t.width/u:1);var h={scaleToFill:[0,0,e,i],aspectFit:[(t.width-t.width*a)/2,(t.height-t.height*n)/2,t.width*a,t.height*n],aspectFill:[(t.width-t.width*a)/2,(t.height-t.height*n)/2,t.width*a,t.height*n],widthFix:[],top:[(e-u)/2,0,u,s],bottom:[(e-u)/2,i-s,u,s],center:[(e-u)/2,(i-s)/2,u,s],left:[0,(i-s)/2,u,s],right:[e-u,(i-s)/2,u,s],"top left":[0,0,u,s],"top right":[e-u,0,u,s],"bottom left":[0,i-s,u,s],"bottom right":[e-u,i-s,u,s]};p&&(w.ctx.save(),w.drawRectPath({x:d,y:c,width:u,height:s,radius:p}),w.ctx.clip()),(r=w.ctx).drawImage.apply(r,[f].concat(_toConsumableArray(h[y]||[]),[w.xDpr(d)||0,w.xDpr(c)||0,w.xDpr(u||t.width),w.xDpr(s||t.height)])),p&&w.ctx.restore(),l()},fail:function(t){r(t)}})},f.onerror=function(t){r(t)}})}};