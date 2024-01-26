import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AIzaSyCdj9IuhiKK_Y3XGkNQMI71EoQFOJ04mc0");
async function test() {
  let resultdiv = document.getElementById("resultdiv");
  let country = document.getElementById("country");
  let legality = document.getElementById("legality");

  const qpara = document.createElement("p");
  qpara.style.verticalAlign = "bottom";
  qpara.innerText = "Country: " + country.value + "  \t \t Legality: " + legality.value + "\n \n";
  resultdiv.appendChild(qpara);

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });

  const prompt = "5 specific instances with details of the actual example of the violations by " + country.value + " in regards to the legality of " + legality.value;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  var converter = new showdown.Converter();
  var html = converter.makeHtml(text);

  // Create a temporary div to set innerHTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Iterate through child nodes and add them to the resultdiv with a delay between words
  async function processNodesWithDelay(nodes, index) {
    if (index < nodes.length) {
      const node = nodes[index];
      const span = document.createElement("span");

      if (node.nodeType === Node.TEXT_NODE) {
        // Text node, add as-is
        span.innerText = node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Element node, add with content
        span.innerHTML = node.outerHTML;
      }

      resultdiv.appendChild(span);

      // Add the 'animate' class to trigger the animation
      setTimeout(() => {
        span.classList.add("animate");

        // Recursively call processNodesWithDelay for the next node
        processNodesWithDelay(nodes, index + 1);
      }, 300); // Delay between words (adjust as needed)
    }
  }

  // Start processing nodes with a delay
  processNodesWithDelay(tempDiv.childNodes, 0);

  country.value = "";
  legality.value = "";
}

document.getElementById("submit").onclick = function () {
  test();
};