const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYO_i5zXCk0cO5zU20Cy-__VVOx72k1Un99mddtP2aumFI4DAbpEYcxcKfdA_jjoyg/exec";


// =====================================================
// MEZCLAR LAS OPCIONES
// =====================================================

function mezclarOpciones() {

  const preguntas = document.querySelectorAll(
    'input[type="radio"]'
  );

  const grupos = {};

  preguntas.forEach(input => {

    if (!grupos[input.name]) {
      grupos[input.name] = [];
    }

    grupos[input.name].push(input);
  });


  Object.values(grupos).forEach(opciones => {

    const contenedor =
      opciones[0].parentElement.parentElement;

    for (let i = opciones.length - 1; i > 0; i--) {

      const j =
        Math.floor(Math.random() * (i + 1));

      const opcionA =
        opciones[i].parentElement;

      const opcionB =
        opciones[j].parentElement;

      const referencia =
        opcionA.nextSibling;

      contenedor.insertBefore(
        opcionA,
        opcionB
      );

      if (referencia) {
        contenedor.insertBefore(
          opcionB,
          referencia
        );
      }
    }
  });
}


// =====================================================
// MEZCLAR OPCIONES DE LOS SELECT
// =====================================================

function mezclarSelects() {

  const selects =
    document.querySelectorAll("select");

  selects.forEach(select => {

    const opciones =
      Array.from(select.options);

    const primera =
      opciones.shift();

    for (let i = opciones.length - 1; i > 0; i--) {

      const j =
        Math.floor(Math.random() * (i + 1));

      [opciones[i], opciones[j]] =
        [opciones[j], opciones[i]];
    }

    select.innerHTML = "";

    select.appendChild(primera);

    opciones.forEach(opcion => {
      select.appendChild(opcion);
    });

  });
}


// =====================================================
// EJECUTAR MEZCLA
// =====================================================

mezclarOpciones();
mezclarSelects();


// =====================================================
// CORRECCIÓN DEL PARCIAL
// =====================================================

document
  .getElementById("examForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();


    const form =
      new FormData(this);


    let puntaje = 0;

    let correctas = 0;

    const respuestas = {};


    // =================================================
    // CALCULAR PUNTAJE
    // =================================================

    for (const [name, value] of form.entries()) {

      if (
        name === "nombre" ||
        name === "apellido" ||
        name === "dni"
      ) {
        continue;
      }


      respuestas[name] = value;


      const puntos =
        Number(value);


      puntaje += puntos;


      if (puntos > 0) {
        correctas++;
      }

    }


    // =================================================
    // REDONDEAR A LA DECENA MÁS CERCANA
    // =================================================

    puntaje =
      Math.round(puntaje / 10) * 10;


    // =================================================
    // DATOS DEL ALUMNO
    // =================================================

    const nombre =
      form.get("nombre").trim();


    const apellido =
      form.get("apellido").trim();


    const dni =
      form.get("dni").trim();


    // =================================================
    // MOSTRAR RESULTADO
    // =================================================

    document.getElementById("saludo").textContent =
      `${nombre} ${apellido}, tu parcial fue corregido automáticamente.`;


    document.getElementById("correctas").textContent =
      correctas;


    document.getElementById("puntaje").textContent =
      puntaje;


    document.getElementById("estado").textContent =
      puntaje >= 40
        ? "Resultado: aprobado"
        : "Resultado: desaprobado";


    document.getElementById("resultado")
      .classList.remove("hidden");


    document.getElementById("resultado")
      .scrollIntoView({
        behavior: "smooth"
      });


    // =================================================
    // ENVIAR A GOOGLE SHEETS
    // =================================================

    const iframe =
      document.createElement("iframe");


    iframe.name =
      "googleSheetsFrame";


    iframe.style.display =
      "none";


    document.body.appendChild(iframe);


    const envio =
      document.createElement("form");


    envio.method =
      "POST";


    envio.action =
      SCRIPT_URL;


    envio.target =
      "googleSheetsFrame";


    envio.style.display =
      "none";


    const datos = {

      nombre: nombre,

      apellido: apellido,

      dni: dni,

      respuestasCorrectas: correctas,

      puntaje: puntaje,

      respuestas:
        JSON.stringify(respuestas)

    };


    for (
      const [nombreCampo, valor]
      of Object.entries(datos)
    ) {

      const input =
        document.createElement("input");


      input.type =
        "hidden";


      input.name =
        nombreCampo;


      input.value =
        valor;


      envio.appendChild(input);

    }


    document.body.appendChild(envio);


    // =================================================
    // ENVIAR
    // =================================================

    envio.submit();

});