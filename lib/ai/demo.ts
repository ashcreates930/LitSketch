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


const D = (prompt: string, look_for: string) => ({ prompt, look_for });

export const DEMO_GENERATION: Generation = {
  status: "ok",
  teacher_message: "",
  title: DEMO_TITLE,
  author: "",
  text_type: "narrative",
  topic_label: "Setting and character",

  vocab: {
    subtitle: "Words from The Keeper's Light",
    words: [
      {
        word: "braced",
        part_of_speech: "verb",
        meaning: "held something firmly in place so it would not move or fall.",
        sentence: "Mara braced the vent closed with her own shoulder so the wind could not get in.",
        paragraph: 4,
        picture: "door",
        doodle_what: "a time you held firm when something pushed back",
        task: {
          kind: "circle",
          prompt: "Circle the words that mean about the same as braced.",
          chips: [
            { text: "held firm", correct: true },
            { text: "let go", correct: false },
            { text: "propped", correct: true },
            { text: "dropped", correct: false },
            { text: "steadied", correct: true },
            { text: "loosened", correct: false },
          ],
          sort_letters: [],
          sort_items: [],
          finish: [],
        },
        divergent: D(
          "When have you had to brace yourself for something hard? What helped you hold on?",
          "Connects bracing to holding firm under pressure",
        ),
      },
      {
        word: "groaned",
        part_of_speech: "verb",
        meaning: "made a long, low sound, as if hurting or straining.",
        sentence: "The old tower groaned as the storm pushed against its walls.",
        paragraph: 2,
        picture: "speech bubble",
        doodle_what: "the sound the storm makes and how it feels",
        task: {
          kind: "sort",
          prompt: "Groan or cheer? Write G or C.",
          chips: [],
          sort_letters: [
            { letter: "G", meaning: "groan" },
            { letter: "C", meaning: "cheer" },
          ],
          sort_items: [
            { text: "Your team loses the big game.", answer: "G" },
            { text: "School is canceled for a snow day.", answer: "C" },
            { text: "The old stairs creak under heavy boots.", answer: "G" },
          ],
          finish: [],
        },
        divergent: D(
          "Why might the author make the tower groan instead of just creak?",
          "Sees the storm making the setting feel alive",
        ),
      },
      {
        word: "steady",
        part_of_speech: "adjective",
        meaning: "firm and even; not shaking or changing.",
        sentence: "Once the wick caught, a long, steady beam swept across the dark water.",
        paragraph: 5,
        picture: "heart",
        doodle_what: "someone who stays steady for you when things get hard",
        task: {
          kind: "finish",
          prompt: "Finish the sentences.",
          chips: [],
          sort_letters: [],
          sort_items: [],
          finish: ["At first, Mara's hands [[shook]] as she struck the match.", "The steady beam helped the [[boats]] find the harbor."],
        },
        divergent: D(
          "How does Mara become steady by the end? What changed inside her?",
          "Links her calm to caring about the boats",
        ),
      },
    ],
  },

  map: {
    title: "Story Map",
    how: "Fill each circle, then follow the arrows. Read the words on the arrows out loud with your answers to retell the whole story.",
    center: ["The Keeper's", "Light"],
    orbits: [
      {
        heading: "Setting",
        icon_hint: "storm",
        lines: ["Where: [[a lighthouse]]", "When: [[a stormy night]]"],
        paragraph: 1,
        divergent: D("How would the story change on a calm, sunny night?", "Explains the storm creates the danger"),
      },
      {
        heading: "Character",
        icon_hint: "person",
        lines: ["Mara must keep the [[lamp]] lit.", "She is home [[alone]]."],
        paragraph: 2,
        divergent: D("What kind of person is Mara before the lamp goes out?", "Uses a detail about her nerves or duty"),
      },
      {
        heading: "Conflict",
        icon_hint: "conflict",
        lines: ["The wind blows open a [[vent]].", "The [[flame]] goes out."],
        paragraph: 3,
        divergent: D("What would you have done when the first two matches failed?", "Weighs a choice against the danger"),
      },
      {
        heading: "Resolution",
        icon_hint: "heart",
        lines: ["She blocks the vent with her [[shoulder]].", "The [[third]] match lights the wick."],
        paragraph: 4,
        divergent: D("Why does her father smile instead of waking her?", "Infers pride or trust from the ending"),
      },
    ],
    links: ["who must…", "but…", "so then…"],
    banner: {
      heading: "Theme",
      starter: "In this story, the storm shows that courage means",
      divergent: D("What does the storm teach Mara about herself?", "States a lesson about courage or responsibility"),
    },
  },

  guided: {
    concept: "Setting",
    lead: "The [[setting]] is where and when a story takes place. It can shape what the [[characters]] do and how the [[plot]] unfolds.",
    boxes: [
      {
        label: "THE PLACE",
        icon_hint: "city",
        text: "The story happens at a [[lighthouse]], far from the [[mainland]].",
        paragraph: 1,
        divergent: D("Why does being far from the mainland matter in this story?", "Notices no one can come help Mara"),
      },
      {
        label: "THE TIME",
        icon_hint: "clock",
        text: "It happens at [[night]], just after [[supper]].",
        paragraph: 1,
        divergent: D("How would daytime change Mara's job?", "Explains the lamp only matters in the dark"),
      },
      {
        label: "THE WEATHER",
        icon_hint: "nature",
        text: "The [[wind]] blows the vent open and puts out the [[flame]].",
        paragraph: 3,
        divergent: D("Which storm detail feels most dangerous to you, and why?", "Picks a detail and explains its effect"),
      },
      {
        label: "SETTING SHAPES MARA",
        icon_hint: "self",
        text: "Alone in the storm, Mara grows from [[scared]] to [[brave]].",
        paragraph: 4,
        divergent: D("How is Mara different at dawn than at supper?", "Describes a change caused by the setting"),
      },
    ],
    your_turn: {
      prompt: "Which parts of the setting make Mara's job harder? Check all that fit.",
      choices: [
        { text: "The storm", correct: true },
        { text: "Being alone", correct: true },
        { text: "The green light", correct: false },
        { text: "Dawn", correct: false },
      ],
      paragraph: 2,
      divergent: D("If you were Mara, which part of the setting would scare you most? Why?", "Connects a setting detail to a feeling"),
    },
    doodle_prompt: "Doodle the moment the setting is most dangerous for Mara.",
  },
};
