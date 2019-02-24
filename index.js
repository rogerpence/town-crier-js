import * as tc  from './town-crier.js';
import * as dom from './rp.dom.js';

const sleep = (milliseconds) => {
   return new Promise(resolve => setTimeout(resolve, milliseconds))
}


// const addCrier = function() {
//     const crierMainContainer = document.querySelector('.all-criers-container');
//     const  placeholderDiv =
//  `<div id="crier-placeholder" style="width: 175px; height: 0; opacity: 0; background-color: red;">
//  </div>`
//     crierMainContainer.insertAdjacentHTML('afterbegin', placeholderDiv);
//  }

const showCrier = () => {
   const townCrier = new tc.TownCrier();
   const html = townCrier.getHTML();
   townCrier.addCrier(html);
}

const msg = [];

msg.push({heading: "Heading 1",
          msg: "Wouldn't it be nice if we were older, then we wouldn't have to wait so long.",
          status: "primary",
          closeType: 'user',
          duration: 6000});






//const addCrierClick = Array.from(document.querySelectorAll('.add-crier'));

setTimeout(showCrier, 2000);
setTimeout(showCrier, 3000);
setTimeout(showCrier, 4000);



//  addCrierClick.forEach(clicker => {
//    clicker.addEventListener('click', e => {
//       console.log('clicked');
//       showCrier();
//       // const townCrier = new tc.TownCrier({name: 'roger'});
//       // const html = townCrier.getHTML();
//       // townCrier.addCrier(html);
//    });
//  });



