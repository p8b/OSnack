import React from "react";
import { render } from "react-dom";
import App from "./app";
import "osnack-frontend-shared/src/_core/type.Extensions";
import "osnack-frontend-shared/src/index";
import {
   GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3';

if (('serviceWorker' in navigator)) {
   navigator.serviceWorker.register('service-worker.js').then(swRegistration => {
      swRegistration.addEventListener('fetch', (event: any) => {
         if (event.request.mode === 'navigate')
            event.respondWith(caches.match('/index.html'));
      });
   });
}



render(
   <GoogleReCaptchaProvider reCaptchaKey="6LfxNycaAAAAAP_-cZ7GUHugSEdqfWIRAiBtl3fX">
      <App />
   </GoogleReCaptchaProvider>, document.getElementById("rootDiv"));
