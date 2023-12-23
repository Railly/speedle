const fs = require('fs');
const { JSDOM } = require('jsdom');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {
  const courseDictionary = {
    'inteligencia-artificial-y-computacion-cognitiva': 9074,
    'percepcion-computacional': 9076,
    'aprendizaje-automatico': 9077,
    'razonamiento-y-planificacion-automatica': 9080,
  };

  const currentCourse = 'aprendizaje-automatico';
  const url = `https://campusvirtual.mexico.unir.net/course/view.php?id=${courseDictionary[currentCourse]}`;
  const cookie = "MoodleSessionMX=<INSERT_VALUE>";

  const cleanName = (name) => {
    return name.replace("∧", "").trim();
  };

  const getData = async () => {
    let csvData = [];
    let currentTema = '';

    try {
      const coursePageResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cookie": cookie
        },
      });

      const coursePageText = await coursePageResponse.text();
      const dom = new JSDOM(coursePageText);
      const document = dom.window.document;

      const elements = Array.from(document.querySelectorAll('li.activity, li.activity.label'));

      for (const element of elements) {
        if (element.classList.contains('label') && element.querySelector('[id^="tema"]')) {
          const temaText = element.querySelector('[id^="tema"]').textContent.trim();
          currentTema = cleanName(temaText);
          console.log('Tema: ', currentTema);
        } else if (element.classList.contains('page') && element.querySelector("a")?.textContent.startsWith("Idea")) {
          const nombre = element.querySelector("a").textContent.trim();
          const link = element.querySelector("a")
          console.log("Nombre: ", nombre);
          console.log("Link: ", link.href);

          const videoPageResponse = await fetch(
            link.href,
            {
              method: "GET",
              headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cookie": cookie
              },
            }
          );

          const videoPageText = await videoPageResponse.text();
          const videoPageDom = new JSDOM(videoPageText);
          const videoIframe = videoPageDom.window.document.querySelector("iframe");

          if (videoIframe) {
            const provider = videoIframe.src.split('/')[2];
            const videoUrl = videoIframe.src;
            csvData.push({ tema: currentTema, nombre, link: videoUrl, provider });
            console.log("Video URL: ", videoUrl);
          } else {
            console.log('No video found');
          }
        }
      }

      return csvData;
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const csvContent = await getData();

  const csvString = 'tema,nombre,link,provider\n' + csvContent.map(row => `"${row.tema}","${row.nombre}","${row.link}","${row.provider}"`).join('\n');

  fs.writeFile(`${currentCourse}.csv`, csvString, function (err) {
    if (err) return console.log(err);
    console.log(`File ${currentCourse}.csv created!`);
  });

})();
