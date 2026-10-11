import type { Generation } from "./schema";

/**
 * Sample used when no OpenAI key is configured in development, and for the
 * "Try a sample passage" button. The story is original to LitSketch.
 */
export const DEMO_TITLE = "The Keeper's Light";
export const DEMO_GRADE = 7;
export const DEMO_BENCHMARK = "ELA.7.R.1.1";

export const DEMO_PASSAGE = `The storm reached Cedar Point just after supper. Mara watched the gray water climb the rocks below the lighthouse, each wave louder than the last. Her father had rowed to the mainland that morning for medicine, and the radio said the ferry would not run again until the wind died.

"Stay inside and keep the lamp lit," he had told her. "That light is the only thing the boats can trust tonight." At the time, it had sounded like an easy job. Now the tower groaned in the wind, and rain hammered the windows like fists.

Mara climbed the iron stairs, counting each of the ninety-two steps the way her father did. At the top, the great lens was dark. The wind had blown open a vent, and the flame had gone out. Her hands shook as she struck the first match. It hissed and died. So did the second.

She thought about the fishing boats she had waved to every morning of her life. Somewhere out in that blackness, Mr. Okafor and his two sons were trying to find the harbor. Mara pulled the vent closed, braced it with her own shoulder, and cupped the third match close to her chest.

The wick caught. Light swelled inside the lens and swept across the water in a long, steady beam. Far below, a small green light blinked back, then another.

When her father climbed the stairs at dawn, soaked and tired, he found Mara asleep against the wall with the matchbox still in her hand. He did not wake her. He only stood beside the lamp, watching it turn, and smiled.`;

export const DEMO_GENERATION: Generation = {
  status: "ok",
  teacher_message: "",
  title: DEMO_TITLE,
  text_type: "narrative",
  benchmark_summary: "I can explain how the setting shapes a character and the events of a story.",
  convergent: {
    big_question: "How does the storm at the lighthouse change Mara and push the plot forward?",
    vocab: [
      { word: "groaned", definition: "Made a long, low sound, as if in pain.", paragraph: 2 },
      { word: "lens", definition: "A curved glass piece that bends and focuses light.", paragraph: 3 },
      { word: "braced", definition: "Held something firmly in place to keep it steady.", paragraph: 4 },
      { word: "steady", definition: "Firm and even; not shaking or changing.", paragraph: 5 },
    ],
    sequence_label: "How the plot unfolds",
    sequence: [
      { starter: "First, the storm arrives and...", answer: "Mara is alone because her father went to the mainland." },
      { starter: "Next, at the top of the tower...", answer: "Mara finds the lamp has gone out because of an open vent." },
      { starter: "Then, Mara thinks about...", answer: "The fishing boats trying to find the harbor in the dark." },
      { starter: "After that, Mara...", answer: "Closes the vent and lights the lamp with the third match." },
      { starter: "Finally, her father...", answer: "Returns at dawn, finds her asleep, and smiles proudly." },
    ],
    evidence: [
      {
        claim: "The storm makes Mara's job feel dangerous.",
        paragraph: 2,
        quote: "Now the tower groaned in the wind, and rain hammered the windows like fists.",
        explanation: "The violent setting turns an easy job into a scary one.",
      },
      {
        claim: "Mara is afraid but keeps going.",
        paragraph: 3,
        quote: "Her hands shook as she struck the first match.",
        explanation: "Shaking hands show fear, but she still tries to light the lamp.",
      },
      {
        claim: "Mara grows brave because she cares about others.",
        paragraph: 4,
        quote: "Somewhere out in that blackness, Mr. Okafor and his two sons were trying to find the harbor.",
        explanation: "Thinking of the boats in the dark sea gives her a reason to be brave.",
      },
    ],
    cloze: {
      text: "During a ___ at Cedar Point, Mara must keep the lighthouse lamp lit while her ___ is away. The wind blows open a ___ and the flame goes out. Thinking of the fishing ___, she blocks the wind with her shoulder. The third ___ lights the wick, and the boats find their way home.",
      answers: ["storm", "father", "vent", "boats", "match"],
      distractors: ["ferry", "radio"],
    },
    checks: [
      {
        question: "Why is Mara alone at the lighthouse?",
        answer: "Her father rowed to the mainland for medicine, and the ferry stopped running.",
        paragraph: 1,
      },
      {
        question: "What part of the setting causes the lamp to go out?",
        answer: "The wind blew open a vent and put out the flame.",
        paragraph: 3,
      },
      {
        question: "How is Mara different at the end than at the start?",
        answer: "She goes from nervous and shaky to brave and successful.",
        paragraph: 6,
      },
    ],
    sum_it_up: "In one sentence, tell how the storm helped show who Mara really is.",
  },
  divergent: {
    central_prompt: "How does a place, or a storm, test who we are?",
    branches: [
      "A sound or image from the storm that stuck with you",
      "One word that describes Mara at the start",
      "One word that describes Mara at the end",
      "Who is counting on Mara tonight?",
      "A moment when the setting made you nervous",
      "What does the light mean to the people at sea?",
    ],
    sketch_prompt: "Draw the moment that matters most in the lighthouse tower.",
    what_ifs: [
      "What if the story happened on a calm, sunny night?",
      "What if Mara's father had been home?",
      "What if the third match had gone out too?",
    ],
    connect_prompt: "Think of a time weather or a place changed someone's plans. What happened?",
    author_prompt: "Write a question you would ask the author about Mara.",
    show_it_prompt: "Show how Mara changes from the start to the end of the story.",
  },
  divergent_key: [
    {
      section: "central",
      look_fors: ["Links the setting to a choice a character makes", "Uses an example from the story"],
      sample: "The storm tests Mara. Alone and scared, she still lights the lamp, which shows she is brave and caring.",
    },
    {
      section: "branches",
      look_fors: ["Details come from the text", "Start and end words show a change in Mara"],
      sample: "Start: nervous. End: brave. Image: rain hammering the windows like fists.",
    },
    {
      section: "sketch",
      look_fors: ["Shows the tower, storm, or lamp", "Includes a label or caption"],
      sample: "A sketch of Mara blocking the vent with her shoulder as the match lights, labeled 'third match.'",
    },
    {
      section: "what_if",
      look_fors: ["Explains how the plot would change", "Explains how Mara might be different"],
      sample: "On a calm night the lamp would not go out, so Mara would never have a chance to prove her courage.",
    },
    {
      section: "connect",
      look_fors: ["Describes a real or imagined situation", "Shows how a place affected a person"],
      sample: "When a hurricane closed our road, my neighbor checked on everyone on our street.",
    },
    {
      section: "author",
      look_fors: ["Question is open, not yes or no", "Connects to the setting or Mara's choices"],
      sample: "Why did you choose a lighthouse, and not a house in town, for this story?",
    },
    {
      section: "show_it",
      look_fors: ["Shows a clear before and after", "Uses at least one detail from the text"],
      sample: "List: shaky hands, two failed matches, then blocking the vent, lighting the lamp, sleeping peacefully.",
    },
  ],
};
