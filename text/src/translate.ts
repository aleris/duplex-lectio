import { AzureOpenAI } from "openai"
import type {
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/index"

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] as string
const deployment = process.env["AZURE_OPENAI_DEPLOYMENT_NAME"] as string
const apiVersion = process.env["OPENAI_API_VERSION"] as string
const apiKey = process.env["AZURE_OPENAI_API_KEY"] as string

function getClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment,
  })
}

function createMessages(text: string): ChatCompletionCreateParamsNonStreaming {
  return {
    messages: [
      { role: "system", content: `You are an expert translator for latin language.
Translated text is like in a translated book, without any additional explanations, just the translation.
The book is a collection of easy latin stories for beginners from 1838 and contains 
many expressions specific to the time and the context of the stories.
You receive input text and provide output as JSON format according to the specifications.
Translate paragraph by paragraph, each paragraph can be either in latin or english.
If the paragraph is in english, translate it to latin. If the paragraph is in latin, translate it to english.
The JSON output contains all the paragraphs.
Each output paragraph includes both the text used as input and the translated text.
The output also includes a translation of each latin word from the latin text to english as an array. 
Even if the original translation was from english to latin, the words section contains latin to english words 
from the latin text. 
The JSON output template is:
{
  "paragraphs": [
    {
      "text": {
        "eng": "<english_text>",
        "lat": "<latin_text>",
      },
      "words: [
        ["<latin_word_1>", "<english_translation_1>"]
        ["<latin_word_2>", "<english_translation_2>"]
      ]
    }
  ]
}
Do not add additional explanations and prefer single word or minimal expression for english translation.
If there are latin alternatives for the english word, pick the one that fits best.
For words make sure to keep the same case as the original text, examples: \`["Est", "Is"], ["Perraro", "Very rarely"], ["Aegyptum", "to Egypt"],\`.
`
      },
      {
        role: "user",
        content: `Translate the following:
I.—THE STORY OF ARION.

Arion, after travelling abroad, hires a vessel to take him home.

1.—Arion citharista praeclarus erat. Is diu apud Periandrum Corinthiorum regem versatus erat. Tum in Italiam Siciliamque navigare cupivit.
`,
      },
      {
        role: "assistant",
        content: `{
  "paragraphs": [
    {
      "text": {
        "eng": "I.—THE STORY OF ARION.",
        "lat": "I.—FABULA ARION"
      },
      "words": [
        ["FABULA", "STORY"],
        ["ARION", "ARION"]
      ]
    },
    {
      "text": {
        "eng": "Arion, after travelling abroad, hires a vessel to take him home.",
        "lat": "Arion, postquam peregre profectus est, navem conducit ut eum domum reducet."
      },
      "words": [
        ["Arion", "Arion"],
        ["postquam", "after"],
        ["peregre", "abroad"],
        ["profectus", "having travelled"],
        ["est", "is"],
        ["navem", "vessel"],
        ["conducit", "hires"],
        ["ut", "to"],
        ["eum", "him"],
        ["domum", "home"],
        ["reducet", "bring back"],
      ]
    },
    {
      "text": {
        "lat": "1.—Arion citharista praeclarus erat. Is diu apud Periandrum Corinthiorum regem versatus erat. Tum in Italiam Siciliamque navigare cupivit.",
        "eng": "1.— Arion was a famous lyre player. He had spent a long time at the court of Periander, king of the Corinthians. Then he wished to sail to Italy and Sicily."
      },
      "words": [
        ["Arion", "Arion"],
        ["citharista", "lyre-player"],
        ["praeclarus", "famous"],
        ["erat", "was"],
        ["Is", "He"],
        ["diu", "long"],
        ["apud", "at"],
        ["Periandrum", "Periander"],
        ["Corinthiorum", "of the Corinthians"],
        ["regem", "king"],
        ["versatus", "spent"],
        ["erat", "was"],
        ["Tum", "Then"],
        ["in", "in"],
        ["Italiam", "Italy"],
        ["Siciliamque", "and Sicily"]
      ]
    }
  ]
}`,
      },
      { role: "user", content: `Translate the following:${text}` },
    ],
    model: "",
  }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

import TextsEasyLatinStories from './TextsEasyLatinStories_partial.ts'

export async function main() {
  const texts = TextsEasyLatinStories
  const client = getClient()
  for (let index = 0; index !== texts.length; index++) {
    console.log(`=== Text ${index + 1} / ${texts.length} ===`)
    const outPath = `./workspace/easy_latin_stories_for_beginners__george_bennett/translated_partial_${`${index + 1}`.padStart(3, '0')}.json`
    if (await Bun.file(outPath).exists()) {
      console.log(`\tFile ${outPath} already exists, skipping text ${index + 1} / ${texts.length}.\n`)
      continue
    }
    const text = texts[index]
    const messages = createMessages(text)
    console.log(`\tSending request for text ${index + 1} / ${texts.length} ...`)
    const result = await client.chat.completions.create(messages)
    console.log(`\tResponse for text ${index + 1} / ${texts.length} received.`)
    console.log(`\tWriting output for text ${index + 1} / ${texts.length} to ${outPath} ...`)
    for (const choice of result.choices) {
      await Bun.write(outPath, choice.message.content ?? '{}')
    }
    console.log(`\tOutput written to ${outPath} for text ${index + 1} / ${texts.length}.`)
    console.log(`\tWaiting 30 seconds ...`)
    await delay(30 * 1000)
    console.log(``)
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})
