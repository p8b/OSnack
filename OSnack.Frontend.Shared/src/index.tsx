((url) => {
   var image = new Image();
   image.onload = () => {
      var style = [
         'padding-top: 20px;',
         'padding-bottom: 20px;',
         'padding-right: 40px;',
         'color: transparent;',
         'background: url(' + url + ');',
         'background-size: 50px;',
         'background-repeat: no-repeat;',
      ].join(' ');
      console.info('%cp8b.uk', style);
   };
   image.src = url;
})('https://p8b.uk/public/images/console.png');
