import type { ReactNode } from "react";

/**
 * Illustration library (style guide: "Illustration library"). Coloring-ready line art in
 * the reference style: 3px round strokes, slightly uneven lines, closed regions with
 * `fw` + one color class f1..f6. Each big object leaves open space to doodle inside.
 *
 * `inside` finishes the tag sentence "Doodle ___ inside the ___."
 * `tags` let the generator match words and ideas to an object.
 * gift, chest, and frames are copied from design-reference/vocab.html.
 */
export type ArtObject = {
  key: string;
  inside: string;
  label: string;
  tags: string[];
  viewBox: string;
  body: ReactNode;
};

const T = "ln thin";

export const OBJECTS: ArtObject[] = [
  {
    key: "gift",
    inside: "box",
    label: "A large gift box with a bow, open space on the front for drawing",
    tags: ["gift", "present", "sacrifice", "give", "generous", "surprise", "holiday", "birthday", "offer", "kindness"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f3" d="M32 104 L268 102 L271 250 L29 252 Z" />
        <path className="fw f1" d="M18 76 L282 73 L284 106 L16 108 Z" />
        <path className="fw f5" d="M138 74 L162 74 L162 107 L138 107 Z" />
        <path className="fw f5" d="M150 74 C118 30 80 40 101 70 C112 80 134 78 150 74 Z" />
        <path className="fw f5" d="M150 74 C182 30 220 40 199 70 C188 80 166 78 150 74 Z" />
        <path className={T} d="M118 52 C126 58 136 66 146 72 M182 52 C174 58 164 66 154 72" />
        <circle className="fw f5" cx="150" cy="73" r="9" />
        <path className="ln dash thin" d="M50 128 L250 127" />
        <path className={T} d="M244 246 l8 -8 M232 246 l20 -20" />
      </>
    ),
  },
  {
    key: "chest",
    inside: "chest",
    label: "An open treasure chest with empty space inside the lid for drawing",
    tags: ["treasure", "precious", "value", "valuable", "wealth", "rich", "secret", "hidden", "gold", "cherish", "fortune"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw" d="M44 126 L56 26 L244 24 L256 126 Z" />
        <path className={T} d="M56 26 L50 76 M244 24 L250 76" />
        <path className="fw f6" d="M32 122 L268 120 L268 138 L32 140 Z" />
        <path className="fw f6" d="M36 140 L264 138 L260 252 L40 254 Z" />
        <path className="ln" d="M84 140 L86 253 M216 139 L214 253" />
        <path className={T} d="M40 196 L84 195 M86 195 L214 194 M216 194 L260 193" />
        <path className="fw f1" d="M134 150 L166 150 L166 186 L134 186 Z" />
        <circle className={T} cx="150" cy="163" r="4" />
        <path className={T} d="M150 167 L150 176" />
        <path className={T} d="M30 110 l-8 -6 M24 124 l-10 0 M274 106 l8 -7 M276 122 l10 0" />
      </>
    ),
  },
  {
    key: "frames",
    inside: "frames",
    label: "Two picture frames hanging from one nail, open for drawing in each",
    tags: ["compare", "contrast", "irony", "ironic", "change", "before", "after", "expect", "opposite", "differ", "two", "transform"],
    viewBox: "0 0 300 250",
    body: (
      <>
        <path className={T} d="M150 14 L78 58 M150 14 L222 56" />
        <circle className="fw f6" cx="150" cy="13" r="6" />
        <path className="fw f4" d="M10 58 L144 52 L148 222 L13 228 Z" />
        <path className="fw" d="M24 72 L131 67 L134 208 L27 213 Z" />
        <path className="fw f2" d="M156 54 L290 58 L287 226 L152 220 Z" />
        <path className="fw" d="M169 68 L276 72 L273 211 L166 206 Z" />
      </>
    ),
  },
  {
    key: "frame",
    inside: "frame",
    label: "One large picture frame on a nail, open for drawing",
    tags: ["picture", "portrait", "image", "memory", "remember", "describe", "scene", "imagery", "vivid", "moment"],
    viewBox: "0 0 300 250",
    body: (
      <>
        <path className={T} d="M150 12 L96 52 M150 12 L206 50" />
        <circle className="fw f6" cx="150" cy="12" r="6" />
        <path className="fw f1" d="M40 50 L262 46 L266 236 L36 240 Z" />
        <path className="fw" d="M60 68 L244 65 L246 218 L58 221 Z" />
        <path className={T} d="M44 54 L60 68 M258 50 L244 65 M262 232 L246 218 M40 236 L58 221" />
      </>
    ),
  },
  {
    key: "book",
    inside: "book",
    label: "A large open book with two blank pages for drawing",
    tags: ["book", "read", "story", "learn", "knowledge", "history", "write", "author", "literature", "study", "education", "page"],
    viewBox: "0 0 300 230",
    body: (
      <>
        <path className="fw f2" d="M150 40 C108 18 54 18 14 32 L14 210 C54 196 108 196 150 218 Z" />
        <path className="fw f2" d="M150 40 C192 18 246 18 286 32 L286 210 C246 196 192 196 150 218 Z" />
        <path className="fw" d="M150 52 C112 34 64 34 28 44 L28 192 C64 182 112 182 150 202 Z" />
        <path className="fw" d="M150 52 C188 34 236 34 272 44 L272 192 C236 182 188 182 150 202 Z" />
        <path className="ln" d="M150 52 L150 214" />
        <path className={T} d="M30 18 l-8 -8 M270 18 l8 -8 M150 12 v-8" />
      </>
    ),
  },
  {
    key: "locker",
    inside: "locker",
    label: "A tall school locker with its door open, empty inside for drawing",
    tags: ["locker", "school", "private", "keep", "store", "belong", "student", "personal", "secret", "middle school"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f2" d="M70 10 L232 12 L230 252 L72 250 Z" />
        <path className="fw" d="M86 30 L216 31 L215 236 L87 235 Z" />
        <path className={T} d="M88 90 L214 90" />
        <path className="fw f2" d="M232 12 L284 30 L282 238 L230 252 Z" />
        <path className={T} d="M246 44 L270 50 M246 54 L270 60 M246 64 L270 70" />
        <path className="fw f1" d="M262 130 L274 132 L274 156 L262 154 Z" />
        <path className={T} d="M100 50 L120 50 M180 50 L200 50" />
      </>
    ),
  },
  {
    key: "lunchbag",
    inside: "lunch bag",
    label: "A folded paper lunch bag with a big blank front for drawing",
    tags: ["lunch", "food", "eat", "meal", "hungry", "share", "snack", "cafeteria", "nourish", "poverty", "feed"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f6" d="M70 64 L230 62 L244 252 L56 254 Z" />
        <path className="fw f1" d="M80 20 L220 18 L230 62 L70 64 Z" />
        <path className={T} d="M78 22 L90 64 M222 20 L210 62 M70 64 L230 62" />
        <path className={T} d="M120 18 C130 34 170 34 180 18" />
        <path className="ln dash thin" d="M80 90 L220 88" />
        <path className={T} d="M60 248 l12 -12 M232 248 l12 -12" />
      </>
    ),
  },
  {
    key: "backpack",
    inside: "backpack",
    label: "A backpack with a big front pocket open for drawing",
    tags: ["backpack", "carry", "burden", "journey", "travel", "pack", "responsibility", "school", "load", "prepare", "hike"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className={T} d="M120 34 C120 8 180 8 180 34" />
        <path className="fw f4" d="M66 70 C66 42 98 30 150 30 C202 30 234 42 234 70 L238 246 L62 248 Z" />
        <path className="fw" d="M90 118 L210 116 L212 232 L88 234 Z" />
        <path className="fw f1" d="M90 118 C110 98 190 96 210 116 Z" />
        <path className={T} d="M150 104 L150 112" />
        <path className="fw f4" d="M40 120 L64 116 L62 220 L38 216 Z" />
        <path className="fw f4" d="M260 120 L236 116 L238 220 L262 216 Z" />
      </>
    ),
  },
  {
    key: "door",
    inside: "door",
    label: "A tall door standing slightly open, with a blank panel for drawing",
    tags: ["door", "opportunity", "enter", "leave", "choice", "open", "close", "escape", "welcome", "new", "begin", "chance", "exit"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f5" d="M64 10 L236 12 L238 254 L62 252 Z" />
        <path className="fw f6" d="M80 26 L210 30 L208 244 L82 240 Z" />
        <path className="fw" d="M98 46 L192 48 L190 222 L100 220 Z" />
        <circle className="fw f1" cx="198" cy="138" r="7" />
        <path className={T} d="M252 70 l14 -6 M254 110 l16 0 M252 150 l14 6" />
        <path className="ln" d="M40 254 L262 254" />
      </>
    ),
  },
  {
    key: "window",
    inside: "window",
    label: "A window with four panes and curtains, open for drawing the view",
    tags: ["window", "view", "see", "observe", "outside", "perspective", "watch", "look", "point of view", "notice", "glimpse"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f2" d="M44 20 L256 18 L258 226 L42 228 Z" />
        <path className="fw" d="M60 36 L240 34 L242 210 L58 212 Z" />
        <path className="ln" d="M150 35 L150 211 M59 123 L241 122" />
        <path className="fw f3" d="M44 20 C70 60 64 160 42 228 L30 228 L32 20 Z" />
        <path className="fw f3" d="M256 20 C230 60 236 160 258 226 L270 226 L268 18 Z" />
        <path className="fw f6" d="M30 228 L270 226 L274 246 L26 248 Z" />
      </>
    ),
  },
  {
    key: "mirror",
    inside: "mirror",
    label: "A tall oval mirror on a stand, open for drawing a reflection",
    tags: ["mirror", "self", "reflect", "reflection", "identity", "appearance", "who am i", "honest", "image", "pride", "vanity", "growth"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <ellipse className="fw f5" cx="150" cy="112" rx="96" ry="106" />
        <ellipse className="fw" cx="150" cy="112" rx="80" ry="90" />
        <path className={T} d="M100 60 C110 44 124 36 138 34" />
        <path className="fw f6" d="M138 218 L162 218 L166 238 L134 238 Z" />
        <path className="fw f6" d="M96 238 L204 238 L210 254 L90 254 Z" />
      </>
    ),
  },
  {
    key: "scroll",
    inside: "scroll",
    label: "An unrolled paper scroll with a blank middle for writing or drawing",
    tags: ["scroll", "law", "rule", "history", "ancient", "message", "document", "decree", "declare", "constitution", "rights", "promise"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f1" d="M50 30 L250 28 L252 232 L48 234 Z" />
        <path className="fw f6" d="M30 20 C30 8 52 8 52 20 L52 42 L30 42 Z" />
        <path className="fw f6" d="M30 20 L270 18 C282 18 282 42 270 42 L30 42 Z" />
        <path className="fw f6" d="M28 222 L268 220 C282 220 282 246 268 246 L28 246 C16 246 16 222 28 222 Z" />
        <path className="ln dash thin" d="M74 70 L226 69" />
      </>
    ),
  },
  {
    key: "banner",
    inside: "banner",
    label: "A wide ribbon banner with folded ends and a blank middle",
    tags: ["banner", "theme", "message", "celebrate", "victory", "award", "pride", "honor", "lesson", "moral", "slogan", "motto"],
    viewBox: "0 0 300 200",
    body: (
      <>
        <path className="fw f1" d="M6 70 L56 70 L56 170 L6 170 L28 120 Z" />
        <path className="fw f1" d="M294 70 L244 70 L244 170 L294 170 L272 120 Z" />
        <path className="fw f6" d="M56 170 L74 186 L74 172 Z M244 170 L226 186 L226 172 Z" />
        <path className="fw f6" d="M74 28 C130 18 170 18 226 28 L226 172 C170 162 130 162 74 172 Z" />
      </>
    ),
  },
  {
    key: "signpost",
    inside: "signs",
    label: "A wooden sign post with three blank arrow signs",
    tags: ["sign", "direction", "choice", "choose", "decide", "decision", "path", "guide", "warning", "crossroads", "way", "future", "options"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f6" d="M140 20 L160 20 L162 254 L138 254 Z" />
        <path className="fw f4" d="M40 34 L240 30 L272 56 L240 82 L40 84 Z" />
        <path className="fw f2" d="M260 100 L60 98 L28 124 L60 152 L260 150 Z" />
        <path className="fw f3" d="M52 168 L232 166 L262 190 L232 216 L52 216 Z" />
        <path className="ln" d="M100 254 L200 254" />
      </>
    ),
  },
  {
    key: "speech",
    inside: "speech bubble",
    label: "A large speech bubble with open space for writing or drawing",
    tags: ["say", "speak", "speech", "dialogue", "argue", "argument", "voice", "persuade", "claim", "tell", "rhetoric", "talk", "quote", "words"],
    viewBox: "0 0 300 250",
    body: (
      <>
        <path className="fw f2" d="M30 30 C30 18 40 12 52 12 L250 10 C264 10 272 18 272 30 L274 168 C274 180 264 188 252 188 L120 190 L66 238 L80 190 L52 190 C40 190 30 182 30 170 Z" />
        <path className={T} d="M282 40 l10 -6 M284 60 l12 0" />
      </>
    ),
  },
  {
    key: "thought",
    inside: "thought cloud",
    label: "A large thought cloud with small bubbles trailing down",
    tags: ["think", "thought", "imagine", "dream", "wonder", "idea", "believe", "memory", "mind", "wish", "hope", "inner", "feeling"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f5" d="M60 150 C24 150 20 104 54 96 C46 56 96 40 116 64 C130 26 196 26 204 66 C236 46 284 70 266 110 C298 126 282 176 244 170 C238 200 190 206 172 184 C150 208 104 204 98 178 C84 186 62 176 60 150 Z" />
        <circle className="fw f5" cx="78" cy="208" r="14" />
        <circle className="fw f5" cx="52" cy="238" r="8" />
      </>
    ),
  },
  {
    key: "bulb",
    inside: "light bulb",
    label: "A large light bulb with open glass for drawing an idea",
    tags: ["idea", "realize", "discover", "invent", "understand", "clever", "insight", "solution", "smart", "inspire", "learn", "aha"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f1" d="M150 14 C90 14 60 58 62 100 C64 136 90 156 104 176 L196 176 C210 156 236 136 238 100 C240 58 210 14 150 14 Z" />
        <path className="fw f5" d="M104 176 L196 176 L192 206 L108 206 Z" />
        <path className={T} d="M108 190 L192 190" />
        <path className="fw f5" d="M116 206 L184 206 C180 226 120 226 116 206 Z" />
        <path className={T} d="M40 40 l-14 -12 M260 40 l14 -12 M30 110 l-18 0 M270 110 l18 0 M150 4 l0 -2" />
      </>
    ),
  },
  {
    key: "jar",
    inside: "jar",
    label: "A large glass jar with a lid, empty for drawing what goes inside",
    tags: ["jar", "collect", "save", "keep", "preserve", "patience", "contain", "gather", "store", "hold", "memories"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f4" d="M96 14 L204 12 L206 44 L94 46 Z" />
        <path className="fw" d="M100 46 C60 60 54 90 56 130 L60 226 C62 244 76 252 96 252 L204 252 C224 252 238 244 240 226 L244 130 C246 90 240 60 200 46 Z" />
        <path className={T} d="M76 92 C74 120 74 150 76 176" />
        <path className={T} d="M94 28 L206 27" />
      </>
    ),
  },
  {
    key: "suitcase",
    inside: "suitcase",
    label: "A suitcase with a handle and a big blank side for drawing",
    tags: ["suitcase", "travel", "move", "journey", "immigrant", "immigration", "leave", "trip", "away", "depart", "pack", "new home", "migrate"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f6" d="M116 50 C116 22 184 22 184 50" />
        <path className="fw f3" d="M24 56 L276 52 L280 238 L20 242 Z" />
        <path className="fw" d="M46 78 L254 75 L256 218 L44 221 Z" />
        <path className="fw f6" d="M76 54 L92 54 L92 240 L76 240 Z" />
        <path className="fw f6" d="M208 53 L224 53 L224 240 L208 240 Z" />
        <circle className="fw" cx="44" cy="248" r="6" />
        <circle className="fw" cx="256" cy="246" r="6" />
      </>
    ),
  },
  {
    key: "map",
    inside: "map",
    label: "A folded paper map with a dotted path and open spaces for drawing",
    tags: ["map", "place", "setting", "explore", "journey", "adventure", "route", "location", "where", "geography", "path", "quest"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f4" d="M14 40 L100 20 L100 230 L14 250 Z" />
        <path className="fw f1" d="M100 20 L200 42 L200 252 L100 230 Z" />
        <path className="fw f2" d="M200 42 L286 22 L286 232 L200 252 Z" />
        <path className="ln dash thin" d="M40 210 C70 170 120 200 150 150 C176 108 220 120 250 70" />
        <path className="ln" d="M240 60 l20 20 M260 60 l-20 20" />
      </>
    ),
  },
  {
    key: "phone",
    inside: "phone screen",
    label: "A phone with a large blank screen for drawing",
    tags: ["phone", "message", "text", "communicate", "technology", "social media", "modern", "connect", "screen", "online", "news"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f5" d="M90 6 C76 6 70 14 70 26 L72 236 C72 248 80 254 92 254 L208 254 C222 254 228 246 228 234 L230 26 C230 12 222 6 210 6 Z" />
        <path className="fw" d="M86 34 L214 34 L214 222 L86 222 Z" />
        <path className={T} d="M130 20 L170 20" />
        <circle className="fw f1" cx="150" cy="238" r="7" />
      </>
    ),
  },
  {
    key: "envelope",
    inside: "envelope",
    label: "An open envelope with a blank letter sticking out for drawing",
    tags: ["letter", "mail", "send", "envelope", "news", "message", "write", "correspondence", "note", "invitation", "secret"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw" d="M60 20 L240 18 L242 170 L58 172 Z" />
        <path className="fw f2" d="M20 110 L150 180 L280 108 L282 250 L18 252 Z" />
        <path className="fw f3" d="M20 110 L150 182 L280 108" />
        <path className={T} d="M18 252 L120 166 M282 250 L180 166" />
        <path className="ln dash thin" d="M80 44 L220 43" />
      </>
    ),
  },
  {
    key: "heart",
    inside: "heart",
    label: "A large heart shape with open space for drawing",
    tags: ["love", "heart", "care", "kind", "kindness", "emotion", "feel", "feeling", "compassion", "loyal", "loyalty", "grief", "friendship", "empathy"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f3" d="M150 246 C80 196 22 150 22 90 C22 46 56 18 96 18 C124 18 142 34 150 54 C158 34 176 18 204 18 C244 18 278 46 278 90 C278 150 220 196 150 246 Z" />
        <path className={T} d="M60 70 C66 52 80 44 96 44" />
      </>
    ),
  },
  {
    key: "lightning",
    inside: "lightning bolt",
    label: "A large lightning bolt with open space for writing or drawing",
    tags: ["conflict", "shock", "sudden", "anger", "angry", "power", "energy", "storm", "danger", "fear", "surprise", "struggle", "tension", "fight"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f1" d="M176 6 L56 142 L134 142 L104 254 L246 98 L166 98 L204 6 Z" />
        <path className={T} d="M40 40 l-12 -8 M262 170 l14 8 M30 200 l-14 4" />
      </>
    ),
  },
  {
    key: "house",
    inside: "house",
    label: "A house with a big blank front wall for drawing",
    tags: ["home", "house", "family", "belong", "shelter", "safe", "community", "neighborhood", "comfort", "roots", "parents"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f3" d="M20 116 L150 14 L280 114 Z" />
        <path className="fw f1" d="M44 112 L256 110 L258 252 L42 254 Z" />
        <path className="fw f6" d="M206 50 L230 50 L230 88 L206 70 Z" />
        <path className="fw f5" d="M128 186 L172 186 L172 252 L128 252 Z" />
        <path className="ln" d="M20 254 L280 254" />
      </>
    ),
  },
  {
    key: "skyline",
    inside: "city",
    label: "A city skyline with tall blank buildings for drawing",
    tags: ["city", "urban", "town", "setting", "community", "society", "crowd", "new york", "street", "neighborhood", "downtown", "place"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <path className="fw f2" d="M14 254 L14 120 L74 118 L74 254 Z" />
        <path className="fw f6" d="M74 254 L76 40 L150 42 L148 254 Z" />
        <path className="fw f4" d="M148 254 L150 96 L214 94 L214 254 Z" />
        <path className="fw f5" d="M214 254 L216 150 L286 148 L286 254 Z" />
        <path className={T} d="M100 24 L100 40 M120 30 L120 42" />
        <path className="ln" d="M4 254 L296 254" />
      </>
    ),
  },
  {
    key: "globe",
    inside: "globe",
    label: "A globe on a stand with open space for drawing",
    tags: ["world", "global", "globe", "culture", "earth", "environment", "nature", "planet", "travel", "nations", "countries", "climate"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <circle className="fw f2" cx="150" cy="112" r="96" />
        <path className="fw f4" d="M92 60 C110 52 130 62 126 82 C122 100 100 96 92 112 C84 96 76 70 92 60 Z" />
        <path className="fw f4" d="M180 150 C200 140 222 150 214 172 C206 190 186 186 176 176 C172 166 172 156 180 150 Z" />
        <path className="ln" d="M246 112 C246 172 200 214 142 216 M150 208 L150 236" />
        <path className="fw f6" d="M100 236 L200 236 L206 254 L94 254 Z" />
      </>
    ),
  },
  {
    key: "two-people",
    inside: "outlines",
    label: "Two person outlines side by side, open for drawing inside each",
    tags: ["relationship", "friend", "friends", "couple", "together", "characters", "people", "family", "pair", "partner", "rival", "compare"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <circle className="fw f3" cx="88" cy="48" r="32" />
        <path className="fw f3" d="M24 254 C24 150 44 100 88 100 C132 100 152 150 152 254 Z" />
        <circle className="fw f2" cx="212" cy="54" r="30" />
        <path className="fw f2" d="M150 254 C150 154 170 106 212 106 C254 106 276 154 276 254 Z" />
      </>
    ),
  },
  {
    key: "person",
    inside: "outline",
    label: "A large person outline, open for drawing inside",
    tags: ["character", "person", "identity", "self", "hero", "trait", "traits", "protagonist", "who", "personality", "narrator"],
    viewBox: "0 0 300 260",
    body: (
      <>
        <circle className="fw f5" cx="150" cy="54" r="42" />
        <path className="fw f5" d="M54 254 C54 146 88 106 150 106 C212 106 246 146 246 254 Z" />
      </>
    ),
  },
];

/** Title art for doodle vocabulary (copied from vocab.html). */
export function PencilPaper() {
  return (
    <svg className="art" viewBox="0 0 120 110" aria-hidden="true" focusable="false">
      <path className="fw f3" d="M20 92 L30 22 C31 15 38 12 44 14 L96 30 C102 32 104 38 102 44 L84 98 C82 104 76 106 70 104 L26 100 C21 99 19 96 20 92 Z" />
      <path className="ln thin" d="M40 40 L84 52 M36 56 L78 68 M33 72 L72 83" />
      <path className="fw f1" d="M98 8 L112 22 L64 70 L48 76 L54 60 Z" />
      <path className="ln thin" d="M90 16 L104 30 M54 60 L64 70" />
      <path className="ln thin" d="M8 30 l6 -3 M4 44 l7 0 M10 16 l5 4" />
    </svg>
  );
}

export function ArtSvg({ obj, className = "art" }: { obj: ArtObject; className?: string }) {
  return (
    <svg className={className} viewBox={obj.viewBox} role="img" aria-label={obj.label} focusable="false">
      {obj.body}
    </svg>
  );
}

function words(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

function score(tags: string[], hint: string, context: string): number {
  const h = hint.toLowerCase().trim();
  const ctx = words(context);
  let s = 0;
  for (const t of tags) {
    if (h && (h === t || h.includes(t) || t.includes(h))) s += 10;
    for (const w of ctx) if (w === t || (w.length > 4 && t.startsWith(w.slice(0, 5)))) s += 1;
  }
  return s;
}

/** Pick the best-matching object for a word or idea, avoiding ones already used on the page. */
export function pickObject(hint: string, context: string, used: Set<string>): ArtObject {
  let best = OBJECTS.find((o) => !used.has(o.key)) ?? OBJECTS[0];
  let bestScore = -1;
  for (const o of OBJECTS) {
    if (used.has(o.key)) continue;
    const sc = score([o.key, ...o.tags], hint, context);
    if (sc > bestScore) {
      best = o;
      bestScore = sc;
    }
  }
  used.add(best.key);
  return best;
}
