export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'coding' | 'quiz';
  content: string; // Detailed guide and code examples
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  duration: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: boolean;
  progress: number;
  tags: string[];
  modules: CourseModule[];
}

export const COURSE_CATEGORIES = [
  'All',
  'Web Fundamentals',
  'Programming Languages',
  'Databases',
  'Frontend Frameworks',
  'Backend & Full Stack',
  'Data Science & AI',
  'Cloud & DevOps',
  'Tools & DSA'
];

const RAW_INITIAL_COURSES: Course[] = [
  // --- CATEGORY 1: WEB FUNDAMENTALS ---
  {
    id: 'intro-to-programming',
    title: '1. Intro to Programming',
    category: 'Web Fundamentals',
    description: 'Programming fundamentals seekhein bilkul scratch se. Variables, Loop, Functions aur Logic building concepts Urdu aur step-by-step guide ke sath.',
    instructor: 'M. Sab',
    instructorTitle: 'Sab Technologies Lead',
    duration: '6 hrs',
    rating: 4.9,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['Programming', 'Logic Building', 'Beginner'],
    modules: [
      {
        id: 'prog-m1',
        title: 'Module 1: Basics of Logic & Variables',
        duration: '3 hrs',
        lessons: [
          {
            id: 'prog-l1',
            title: '1.1 What is Programming & Setup',
            duration: '45m',
            completed: false,
            type: 'video',
            content: `### Programming Kya Hai? (What is Programming?)
Computer ek machine hai jo khud se kuch nahi kar sakti. Hum use instructions dete hain jo ke programming kehlati hain.

### Key Concepts:
1. **Compiler/Interpreter**: Jo hamare English-like code ko machine code (0s & 1s) mein convert karta hai.
2. **Variables**: Ek container jis mein data store kiya jata hai.

### Code Example (Python & JS Variables):
\`\`\`javascript
// JavaScript Variables
let name = "Sab Technologies";
const pi = 3.1415;
let isLearning = true;

console.log("Welcome to " + name);
\`\`\`

\`\`\`python
# Python Variables
name = "Sab Technologies"
pi = 3.1415
is_learning = True

print(f"Welcome to {name}")
\`\`\``
          },
          {
            id: 'prog-l2',
            title: '1.2 Conditionals & Control Flow',
            duration: '60m',
            completed: false,
            type: 'coding',
            content: `### Conditionals: Decisions in Code
Conditionals humein decision-making ki permission dete hain. Agor condition true ho to ek block execute hota hai, varna doosra.

### Structure:
- \`if\`: Basic check
- \`else if\` / \`elif\`: Multiple checks
- \`else\`: Fallback option

### Code Example (Decision Making):
\`\`\`javascript
let score = 85;

if (score >= 90) {
    console.log("Grade: A+");
} else if (score >= 70) {
    console.log("Grade: B");
} else {
    console.log("Grade: C");
}
\`\`\``
          }
        ]
      },
      {
        id: 'prog-m2',
        title: 'Module 2: Loops & Functions',
        duration: '3 hrs',
        lessons: [
          {
            id: 'prog-l3',
            title: '2.1 Mastering Loops (For & While)',
            duration: '90m',
            completed: false,
            type: 'coding',
            content: `### Loops: Repetitive Tasks
Jab humein koi kaam baar baar karna ho, hum loop use karte hain.

### Types of Loops:
1. **For Loop**: Jab humein exact steps pta hon.
2. **While Loop**: Jab humein task kisi condition ke true hone tak chalana ho.

### Code Example:
\`\`\`javascript
// Print numbers from 1 to 5 using For Loop
for (let i = 1; i <= 5; i++) {
    console.log("Step Number: " + i);
}

// Countdown using While Loop
let countdown = 5;
while (countdown > 0) {
    console.log("Count: " + countdown);
    countdown--;
}
\`\`\``
          },
          {
            id: 'prog-l4',
            title: '2.2 Functions and Variable Scope',
            duration: '90m',
            completed: false,
            type: 'coding',
            content: `### Functions: Reusable Blocks of Code
Functions code ko modular aur clean banate hain. Ek bar likhein aur bar bar use karein.

### Code Example:
\`\`\`javascript
// Function declaration with Parameters & Return Value
function calculateTax(amount, taxRate = 0.15) {
    let tax = amount * taxRate;
    return tax;
}

// Function call
let myTax = calculateTax(1000);
console.log("Tax is: " + myTax); // Out: 150
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'intro-html-css',
    title: '2. Intro to HTML & CSS',
    category: 'Web Fundamentals',
    description: 'Web development ka pehla qadam. HTML skeleton banana aur CSS styling se elements ko khubsurat design karna seekhein.',
    instructor: 'Ayesha Khan',
    instructorTitle: 'Senior UI/UX Engineer',
    duration: '5 hrs',
    rating: 4.8,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['HTML', 'CSS', 'Web Fundamentals'],
    modules: [
      {
        id: 'htmlcss-m1',
        title: 'Module 1: Web Pages & Structure',
        duration: '5 hrs',
        lessons: [
          {
            id: 'htmlcss-l1',
            title: '1.1 Static Web Pages Foundation',
            duration: '120m',
            completed: false,
            type: 'video',
            content: `### How Web Works
Browser server ko request send karta hai aur response mein HTML/CSS fetch karta hai jo screen par render hoti hai.

### Basic HTML Document:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; text-align: center; }
        h1 { color: #ff6b2b; }
    </style>
</head>
<body>
    <h1>Hello World from Sab Technologies!</h1>
    <p>HTML skeleton build karna seekhein.</p>
</body>
</html>
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'html-advanced',
    title: '3. HTML (Semantic & Structuring)',
    category: 'Web Fundamentals',
    description: 'Semantic tags, interactive forms, tables, media elements, style guides aur HTML elements ka complete handbook scratch se seekhein.',
    instructor: 'Ali Raza',
    instructorTitle: 'Frontend Architect',
    duration: '18 hrs',
    rating: 4.8,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['HTML5', 'Semantic Web', 'SEO', 'W3Schools Standard'],
    modules: [
      {
        id: 'html-m1',
        title: 'Module 1: HTML Basics & Setup',
        duration: '3 hrs',
        lessons: [
          {
            id: 'html-l1',
            title: '1.1 HTML HOME',
            duration: '45m',
            completed: false,
            type: 'video',
            content: `### Welcome to HTML Home!
HTML (HyperText Markup Language) web pages design karne ki standard language hai.

### Key Highlights:
1. **Easy to Learn**: HTML simple English tags use karta hai.
2. **Platform Independent**: Kisi bhi browser (Chrome, Edge, Safari) par run hota hai.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>HTML Home</title>
  </head>
  <body>
    <h1>HTML Home Tutorial mein Khushamdeed!</h1>
  </body>
</html>
\`\`\``
          },
          {
            id: 'html-l2',
            title: '1.2 HTML Introduction',
            duration: '45m',
            completed: false,
            type: 'video',
            content: `### HTML Introduction
HTML browser ko batata hai ke web page ka content kis tarah dikhana hai.

### Tags vs Elements:
- **Tag**: \`<p>\` (opening tag), \`</p>\` (closing tag).
- **Element**: Opening tag se lekar closing tag tak ka poora content block.

\`\`\`html
<p>Yeh ek HTML paragraph element hai.</p>
\`\`\``
          },
          {
            id: 'html-l3',
            title: '1.3 HTML Editors',
            duration: '45m',
            completed: false,
            type: 'coding',
            content: `### HTML Editors
Aap HTML code kisi bhi plain text editor mein likh sakte hain, jaise VS Code, Notepad (Windows), ya TextEdit (Mac).

### Setup Practice:
1. Open VS Code or Notepad.
2. Code likhein aur file ko \`.html\` ya \`.htm\` extension ke sath save karein (e.g., \`index.html\`).
3. Save karne ke baad browser mein open karein.`
          },
          {
            id: 'html-l4',
            title: '1.4 HTML Basic',
            duration: '45m',
            completed: false,
            type: 'coding',
            content: `### HTML Basic Structure
Har HTML document ka ek base skeleton hota hai jo is tarah se dikhta hai:

\`\`\`html
<!DOCTYPE html> <!-- Document type declaration -->
<html> <!-- Root element -->
<head>
    <title>Basic HTML Page</title>
</head>
<body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
</body>
</html>
\`\`\``
          }
        ]
      },
      {
        id: 'html-m2',
        title: 'Module 2: Elements, Attributes & Formatting',
        duration: '4 hrs',
        lessons: [
          {
            id: 'html-l5',
            title: '2.1 HTML Elements',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Elements Deep Dive
Nested elements standard tree structure banate hain.

### Key Rules:
- Hamesha closing tags add karein.
- Empty elements (jaise \`<br>\`, \`<img>\`) ka koi closing tag nahi hota.

\`\`\`html
<p>Hum paragraph ke andar <b>bold text</b> use kar rahe hain.</p>
\`\`\``
          },
          {
            id: 'html-l6',
            title: '2.2 HTML Attributes',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Attributes
Attributes HTML elements ko supplementary settings and values faraham karte hain.

### Examples:
- \`href\` attribute inside \`<a>\` (Link URL)
- \`src\` and \`alt\` inside \`<img>\`

\`\`\`html
<a href="https://leetmaster-app.live" target="_blank">Visit LeetMaster</a>
\`\`\``
          },
          {
            id: 'html-l7',
            title: '2.3 HTML Headings',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Headings
HTML headings \`<h1>\` se \`<h6>\` tak standard levels define karti hain.

\`\`\`html
<h1>Heading 1 (Main Heading)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 (Smallest)</h6>
\`\`\``
          },
          {
            id: 'html-l8',
            title: '2.4 HTML Paragraphs',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Paragraphs
Paragraphs define karne ke liye \`<p>\` tag ka use kiya jata hai.

### Whitespace Behavior:
Browser multiple consecutive white spaces ko automatically skip kar deta hai. Line breaks ke liye \`<br>\` use karein.

\`\`\`html
<p>Line complete.<br>Nayi line start ho gayi.</p>
\`\`\``
          },
          {
            id: 'html-l9',
            title: '2.5 HTML Styles',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Inline Styles (CSS)
Inline styles ke zariye element ko direct visual features diye jate hain.

\`\`\`html
<h1 style="color: #ff6b2b; text-align: center;">Orange Centered Title</h1>
<p style="font-family: monospace; background-color: #f5f5f5;">Code background look.</p>
\`\`\``
          },
          {
            id: 'html-l10',
            title: '2.6 HTML Formatting',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Formatting Elements
Text formatting tags text ka style define karte hain:

- \`<b>\` - Bold text
- \`<strong>\` - Important text
- \`<i>\` - Italic text
- \`<em>\` - Emphasized text
- \`<mark>\` - Highlighted text
- \`<small>\` - Smaller text
- \`<del>\` - Deleted (strikethrough) text
- \`<ins>\` - Inserted text
- \`<sub>\` - Subscript
- \`<sup>\` - Superscript`
          },
          {
            id: 'html-l11',
            title: '2.7 HTML Quotations',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Quotations in HTML
Quotations aur citations display karne ke liye specialised tags:

- \`<blockquote>\`: External source se section block quote karne ke liye.
- \`<q>\`: Short inline double quotation marks ke liye.
- \`<abbr>\`: Abbreviations handle karne ke liye (tooltip show karta hai).

\`\`\`html
<p>Einstein ne farmaya tha: <q>E = mc²</q></p>
\`\`\``
          },
          {
            id: 'html-l12',
            title: '2.8 HTML Comments',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Comments
Comments developer ke notes ke liye hote hain aur user ko display nahi hote.

### Syntax:
\`\`\`html
<!-- Yeh ek single or multi-line comment hai -->
<p>Active display line.</p>
\`\`\``
          }
        ]
      },
      {
        id: 'html-m3',
        title: 'Module 3: Visuals, CSS, Links & Images',
        duration: '3 hrs',
        lessons: [
          {
            id: 'html-l13',
            title: '3.1 HTML Colors',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Colors
Colors dynamically select karne ke teen tarike:

1. **Color Names**: Red, Orange, Tomato, SlateGray
2. **Hex Values**: #ff6b2b, #ffffff
3. **RGB Values**: rgb(255, 107, 43)

\`\`\`html
<div style="background-color: #ff6b2b; color: white; padding: 10px;">
    Sab Technologies Orange Block
</div>
\`\`\``
          },
          {
            id: 'html-l14',
            title: '3.2 HTML CSS',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Adding CSS to HTML
Styling teen methods se apply ki ja sakti hai:

- **Inline CSS**: Element ke andar direct style attribute se.
- **Internal CSS**: Head section mein \`<style>\` tag ke zariye.
- **External CSS**: Alag file (.css) link karke.

\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\``
          },
          {
            id: 'html-l15',
            title: '3.3 HTML Links',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Hyperlinks
Links create karne ke liye anchor (\`<a>\`) tag use hota hai.

### Attributes:
- \`href\`: Destination target URL.
- \`target="_blank"\`: Link ko naye window/tab mein open karne ke liye.

\`\`\`html
<a href="https://leetmaster-app.live" target="_blank">Open App</a>
\`\`\``
          },
          {
            id: 'html-l16',
            title: '3.4 HTML Images',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Images
Web pages par images display karne ke liye \`<img>\` tag use kiya jata hai.

### Important:
- **src**: Path pointer or image URL.
- **alt**: Alternative description jo text form mein load hoti hai agar image fail ho jaye.

\`\`\`html
<img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12" alt="Web Layout Design" style="width: 100%; max-width: 400px; border-radius: 8px;">
\`\`\``
          },
          {
            id: 'html-l17',
            title: '3.5 HTML Project',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Creating your First HTML Project
Ek basic landing page project structure generate karein:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Landing Page</title>
</head>
<body>
    <h1>Welcome to My Portfolios</h1>
    <p>Creating functional designs with simple markup structure.</p>
</body>
</html>
\`\`\``
          },
          {
            id: 'html-l18',
            title: '3.6 HTML Favicon',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Favicons in HTML
Favicon ek choti image hoti hai jo browser tab mein title ke sath show hoti hai.

### Setup Code:
\`\`\`html
<head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
\`\`\``
          },
          {
            id: 'html-l19',
            title: '3.7 HTML Page Title',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Page Title
\`<title>\` tag head segment mein page ka title name define karta hai jo tab browser display karta hai aur SEO rank index karta hai.

\`\`\`html
<head>
    <title>Mastering HTML 41 Topics</title>
</head>
\`\`\``
          }
        ]
      },
      {
        id: 'html-m4',
        title: 'Module 4: Tables, Lists & Blocks',
        duration: '3 hrs',
        lessons: [
          {
            id: 'html-l20',
            title: '4.1 HTML Tables',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Tables
Tables vertical rows and columns data management ke liye define hoti hain.

- \`<table>\`: Container element.
- \`<tr>\`: Table Row.
- \`<th>\`: Table Header (Bold, Centered).
- \`<td>\`: Table Cell Data.

\`\`\`html
<table border="1" style="width: 100%; border-collapse: collapse;">
  <tr>
    <th>Topic</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>HTML Elements</td>
    <td>Completed</td>
  </tr>
</table>
\`\`\``
          },
          {
            id: 'html-l21',
            title: '4.2 HTML Lists',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Lists
Information points render karne ke liye lists:

1. **Unordered Lists (\`<ul>\`)**: Bullet markers create hote hain.
2. **Ordered Lists (\`<ol>\`)**: Number/Alphabet sequences design hote hain.

\`\`\`html
<ul>
  <li>HTML HOME</li>
  <li>HTML Introduction</li>
</ul>
\`\`\``
          },
          {
            id: 'html-l22',
            title: '4.3 HTML Block & Inline',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### Block vs Inline Elements
Layout structure elements do divisions mein split hote hain:

- **Block Elements**: Nayi line se start hote hain aur complete row space consume karte hain. Examples: \`<div>\`, \`<p>\`, \`<h1>-<h6>\`.
- **Inline Elements**: Nayi line se start nahi hote aur sirf target content width cover karte hain. Examples: \`<span>\`, \`<a>\`, \`<strong>\`.`
          },
          {
            id: 'html-l23',
            title: '4.4 HTML Div',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Div Container
\`<div>\` ek multipurpose generic block division container hai, jo sub-sections ki styling aur management ke liye use hota hai.

\`\`\`html
<div style="background-color: #f9f9f9; border-left: 4px solid #ff6b2b; padding: 10px;">
    <h3>Sidebar Alert</h3>
    <p>Always practice code templates!</p>
</div>
\`\`\``
          },
          {
            id: 'html-l24',
            title: '4.5 HTML Classes',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Class Attribute
Class attribute generic identity groups create karne ke liye use hota hai. Multiple elements ek jaisi class share kar sakte hain.

\`\`\`html
<style>
  .card-item { background: #fff; padding: 15px; border-radius: 8px; }
</style>

<div class="card-item">Topic 1</div>
<div class="card-item">Topic 2</div>
\`\`\``
          },
          {
            id: 'html-l25',
            title: '4.6 HTML Id',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Id Attribute
Id pure HTML code page mein single unique identity define karne ke liye target hoti hai. Ek page par ek id sirf ek hi element ki ho sakti hai.

\`\`\`html
<div id="main-navigation-bar">
    <p>Nav Content</p>
</div>
\`\`\``
          },
          {
            id: 'html-l26',
            title: '4.7 HTML Buttons',
            duration: '30m',
            completed: false,
            type: 'coding',
            content: `### HTML Button Elements
Click actions performance trigger links standard setup:

\`\`\`html
<button onclick="alert('Congratulations!')" style="background: #ff6b2b; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">
  Click Me ✓
</button>
\`\`\``
          }
        ]
      },
      {
        id: 'html-m5',
        title: 'Module 5: Advanced & Interactive HTML',
        duration: '2.5 hrs',
        lessons: [
          {
            id: 'html-l27',
            title: '5.1 HTML Iframes',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### HTML Iframes
Iframes current web screen ke andr dusra independent sub page load karne ke liye embed tools offer karte hain.

\`\`\`html
<iframe src="https://leetmaster-app.live" width="100%" height="300" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>
\`\`\``
          },
          {
            id: 'html-l28',
            title: '5.2 HTML JavaScript',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### JavaScript Integration
\`<script>\` tag client script animations and logical handlers dynamic connections links render karta hai.

\`\`\`html
<button onclick="changeText()">Click</button>
<p id="demo">Old Text</p>

<script>
function changeText() {
    document.getElementById("demo").innerHTML = "Interactive JS works!";
}
</script>
\`\`\``
          },
          {
            id: 'html-l29',
            title: '5.3 HTML File Paths',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### File Path Rules
Files sources link folders location references guides:

1. **Absolute Paths**: Complete external links (e.g., \`https://google.com/icon.png\`)
2. **Relative Paths**: Current working project location indexes (e.g., \`./images/profile.jpg\` or \`../index.html\`)`
          },
          {
            id: 'html-l30',
            title: '5.4 HTML Head',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### HTML Head Section
Head block browser properties aur styles load data manage karta hai:

- \`<meta>\`: Character sets, author details, dynamic mobile responsive scales.
- \`<link>\`: Stylesheets paths integration.
- \`<script>\`: Functional libraries integration.`
          },
          {
            id: 'html-l31',
            title: '5.5 HTML Layout',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### HTML Structural Layouts
Semantic grid sections code management readable templates generate karte hain:

\`\`\`html
<header>My Web Banner Header</header>
<nav>My Navigation Menu Links</nav>
<main>
  <article>Primary Article Content</article>
</main>
<footer>Standard Footer Details</footer>
\`\`\``
          },
          {
            id: 'html-l32',
            title: '5.6 HTML Responsive',
            duration: '25m',
            completed: false,
            type: 'coding',
            content: `### Responsive Layout design
Web pages display configurations screen size ke mutabiq load elements maintain rules:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

Is element ke zariye user devices mobile vertical widths adjust rules execute standard layout formats scale down correctly.`
          }
        ]
      },
      {
        id: 'html-m6',
        title: 'Module 6: Code, Semantics, Standards & References',
        duration: '2.5 hrs',
        lessons: [
          {
            id: 'html-l33',
            title: '6.1 HTML Computercode',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### Technical Code Elements
Code snippets standard design monospaced format rendering layout guides:

- \`<code>\`: Single code values inline display formatting.
- \`<pre>\`: Preserves whitespace, indentation levels exactly matching text editors source styles.

\`\`\`html
<pre>
function hello() {
    console.log("Urdu Coding tutorials");
}
</pre>
\`\`\``
          },
          {
            id: 'html-l34',
            title: '6.2 HTML Semantics',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### Semantic Elements
Semantic tags page modules blocks ka real, meaningful structure clarify karte hain jo screen readers aur SEO systems parse rules evaluate index standard performance support karte hain.

Examples: \`<article>\`, \`<aside>\`, \`<details>\`, \`<figcaption>\`, \`<figure>\`, \`<footer>\`, \`<header>\`, \`<main>\`, \`<mark>\`, \`<nav>\`, \`<section>\`, \`<summary>\`, \`<time>\`.`
          },
          {
            id: 'html-l35',
            title: '6.3 HTML Style Guide',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### Style Guide and Best Practices
Beautiful standards follow-ups clean formatting:

1. **Lower Case Tags**: Hamesha lowercase tags use karein (\`<body>\` over \`<BODY>\`).
2. **Double Quotes**: Attributes values ke gird hamesha quotes lagayein (\`class="item"\`).
3. **Indentation**: Standard spaces tab nested files code structure management maintain.`
          },
          {
            id: 'html-l36',
            title: '6.4 HTML Entities',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### HTML Entities
HTML elements character symbols print solutions. Browser reserved symbols parse syntax compile karke conflicts reduce karta hai.

- \`&lt;\`: Less than tag symbol (\`<\`)
- \`&gt;\`: Greater than tag symbol (\`>\`)
- \`&amp;\`: Ampersand symbol (\`&\`)
- \`&nbsp;\`: Non-breaking single space spacing layout block.

\`\`\`html
<p>Syntax of bold text is: &lt;b&gt;Text&lt;/b&gt;</p>
\`\`\``
          },
          {
            id: 'html-l37',
            title: '6.5 HTML Symbols',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### HTML Symbols
Standard math equations symbols configurations:

- \`&forall;\`: For all symbol (\`∀\`)
- \`&part;\`: Partial differential (\`∂\`)
- \`&euro;\`: Euro currency symbol (\`€\`)

\`\`\`html
<p>Euro Symbol is: &euro;</p>
\`\`\``
          },
          {
            id: 'html-l38',
            title: '6.6 HTML Emojis',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### HTML Emojis
Emojis unicode points display structures. Server meta standard tags correct UTF-8 configure karne ke baad display rules render details:

- Happy smile code: \`&#128512;\` (😀)
- Computer icon code: \`&#128187;\` (💻)

\`\`\`html
<p>Keep smiling &#128512; and code!</p>
\`\`\``
          },
          {
            id: 'html-l39',
            title: '6.7 HTML Charsets',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### HTML Character Sets
Browser documents characters data read render standards identify setups:

\`\`\`html
<meta charset="UTF-8">
\`\`\`

UTF-8 standard setup almost globally sare characters symbols and letters complete languages sets mapping print support provides.`
          },
          {
            id: 'html-l40',
            title: '6.8 HTML URL Encode',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### URL Encoding
URL query strings parameters data security conversions structures. Browser values safety conversions standard URLs convert rules trigger.

For example, dynamic spaces convert to \`%\` standard numeric configurations rules safely.`
          },
          {
            id: 'html-l41',
            title: '6.9 HTML vs. XHTML',
            duration: '15m',
            completed: false,
            type: 'coding',
            content: `### HTML vs XHTML comparisons
Differences between standard HTML layouts vs XML parse standard definitions strict markup rule sets:

- **Strict Validation**: XHTML tags nested matching cases uppercase errors crash page loads instantly.
- **Tag Closure**: Har single element explicitly self-closed standard required syntax properties configurations follow (e.g., \`<br />\`).`
          }
        ]
      }
    ]
  },
  {
    id: 'css-layouts',
    title: '4. CSS (Flexbox, Grid & Responsive)',
    category: 'Web Fundamentals',
    description: 'Styling ke advanced tools: CSS Grid, Flexbox, media queries aur clean modern keyframe animations.',
    instructor: 'Zainab Jamil',
    instructorTitle: 'CSS specialist',
    duration: '12 hrs',
    rating: 4.9,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['CSS', 'Flexbox', 'CSS Grid', 'Responsive'],
    modules: [
      {
        id: 'css-m1',
        title: 'Module 1: Flexbox vs Grid layouts',
        duration: '6 hrs',
        lessons: [
          {
            id: 'css-l1',
            title: '1.1 Flexbox Deep Dive',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### CSS Flexbox (Flexible Box Layout)
Flexbox 1-Dimensional layouts design karne ke liye perfect tool hai (either row or column).

### Essential Properties:
- \`display: flex;\`
- \`justify-content\`: Main-axis spacing (center, space-between, space-around)
- \`align-items\`: Cross-axis vertical spacing
- \`flex-direction\`: row, column

### Code Example:
\`\`\`css
.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1a1a1a;
    padding: 1rem;
}

.nav-links {
    display: flex;
    gap: 15px;
    list-style: none;
}
\`\`\``
          },
          {
            id: 'css-l2',
            title: '1.2 CSS Grid Mastery',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### CSS Grid Layout
Grid ek 2-Dimensional layout system hai (Rows and Columns dono ek sath).

### Code Example:
\`\`\`css
.bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.item-large {
    grid-column: span 2;
    background: #ff6b2b;
    color: white;
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'w3css-framework',
    title: '5. W3.CSS (Lightweight UI)',
    category: 'Web Fundamentals',
    description: 'W3.CSS framework ka use karke fast, lightweight aur high-contrast responsive interfaces design karein.',
    instructor: 'Asim Baig',
    instructorTitle: 'Frontend Dev',
    duration: '4 hrs',
    rating: 4.5,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['W3.CSS', 'CSS frameworks', 'Fast Coding'],
    modules: [
      {
        id: 'w3-m1',
        title: 'Module 1: W3.CSS Setup & Grids',
        duration: '4 hrs',
        lessons: [
          {
            id: 'w3-l1',
            title: '1.1 W3.CSS Basics & Grid Cards',
            duration: '120m',
            completed: false,
            type: 'coding',
            content: `### W3.CSS: Framework Introduction
W3.CSS ek lightweight CSS framework hai jo pure CSS utilities ke sath responsive design banata hai. No JS dependencies!

### Setup CDN:
\`\`\`html
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
\`\`\`

### Pre-built Component Cards Example:
\`\`\`html
<div class="w3-container w3-teal">
  <h1>My Web Header</h1>
</div>

<div class="w3-row-padding w3-margin-top">
  <div class="w3-third">
    <div class="w3-card-4 w3-white">
      <div class="w3-container">
        <h3>W3.CSS Card</h3>
        <p>Extremely lightweight design pattern.</p>
      </div>
    </div>
  </div>
</div>
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'sass-preprocessor',
    title: '6. Sass (Syntactically Awesome Style Sheets)',
    category: 'Web Fundamentals',
    description: 'Sass variables, nesting blocks, mixins reusable codes, partial templates aur dynamic custom compilation tools.',
    instructor: 'Zara Ahmed',
    instructorTitle: 'CSS Preprocessor Architect',
    duration: '6 hrs',
    rating: 4.7,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Sass', 'CSS Compiler', 'Styling'],
    modules: [
      {
        id: 'sass-m1',
        title: 'Module 1: Variables, Nesting & Mixins',
        duration: '6 hrs',
        lessons: [
          {
            id: 'sass-l1',
            title: '1.1 Nesting & Mixins Functions',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### Sass (SCSS) Syntax
Sass style sheets ko functional program ki tarah manage karne ki permission deta hai.

### SCSS Features Code:
\`\`\`scss
// Variables
$primary-color: #ff6b2b;
$bg-dark: #121212;

// Reusable Mixin (Like Functions)
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

// Nesting Rules
.card {
    background-color: $bg-dark;
    padding: 20px;
    
    .card-title {
        color: $primary-color;
        font-size: 1.5rem;
    }
    
    .btn-action {
        @include flex-center;
        border-radius: 8px;
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'bootstrap-framework',
    title: '7. Bootstrap (Responsive Framework)',
    category: 'Web Fundamentals',
    description: 'Bootstrap 5 framework. 12-column grid structure, navbar responsive elements, modals aur utility layouts.',
    instructor: 'Hassan Jamil',
    instructorTitle: 'Lead Product Developer',
    duration: '7 hrs',
    rating: 4.6,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['Bootstrap', 'Responsive', 'UI Kit'],
    modules: [
      {
        id: 'boot-m1',
        title: 'Module 1: 12-Column Grid & UI Components',
        duration: '7 hrs',
        lessons: [
          {
            id: 'boot-l1',
            title: '1.1 Grid System & Modals',
            duration: '210m',
            completed: false,
            type: 'coding',
            content: `### Bootstrap 12-Column Grid
Grid rows aur columns (xs, sm, md, lg, xl, xxl) ke combination se responsive layouts banata hai.

### Bootstrap Layout Example:
\`\`\`html
<div class="container my-5">
    <div class="row">
        <div class="col-md-8 col-sm-12 bg-light p-4 rounded shadow-sm">
            <h2>Main Workspace Article</h2>
            <p>This layout automatically stacks on mobile sizes!</p>
        </div>
        <div class="col-md-4 col-sm-12 bg-dark text-white p-4 rounded">
            <h3>Side Utilities Panel</h3>
        </div>
    </div>
</div>
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 2: PROGRAMMING LANGUAGES ---
  {
    id: 'javascript-mastery',
    title: '8. JavaScript (ES6+ & Async)',
    category: 'Programming Languages',
    description: 'Modern JavaScript depth se seekhein. Async/Await, Promises, Closures, Scopes aur Core Engines deep technical understanding.',
    instructor: 'Daniyal Sheikh',
    instructorTitle: 'Core Node Contributor',
    duration: '15 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['JS', 'ES6', 'Asynchronous', 'Web Core'],
    modules: [
      {
        id: 'js-m1',
        title: 'Module 1: Advanced JS Scopes & Engines',
        duration: '7 hrs',
        lessons: [
          {
            id: 'js-l1',
            title: '1.1 Closures & Context Engines',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### Closures in JavaScript
Closure tab banta hai jab ek inner function apne outer function ke variable scope ko reference karta hai, tab bhi jab outer function execute ho chuka ho.

### Code Example:
\`\`\`javascript
function createCounter() {
    let count = 0; // State is hidden and encapsulated
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        }
    }
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
\`\`\``
          }
        ]
      },
      {
        id: 'js-m2',
        title: 'Module 2: Asynchronous JS Engine',
        duration: '8 hrs',
        lessons: [
          {
            id: 'js-l2',
            title: '2.1 Promises & Async/Await',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### Asynchronous Engines
Event Loop, Microtask Queue aur Callbacks mechanism ko understand karein.

### Promises & Async/Await Pattern:
\`\`\`javascript
async function fetchUserDashboard(userId) {
    try {
        const response = await fetch(\`/api/profile/\${userId}\`);
        if (!response.ok) throw new Error("Network response failed");
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Fetch error details:", err.message);
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'python-advanced',
    title: '9. Python (Core & Advanced OOP)',
    category: 'Programming Languages',
    description: 'Python syntax basics to advanced algorithms, Object Oriented Programming, Virtual Environments, Packages and decorators.',
    instructor: 'Rao Farhan',
    instructorTitle: 'Data Systems Consultant',
    duration: '14 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Python', 'OOP', 'Data Engineering'],
    modules: [
      {
        id: 'py-m1',
        title: 'Module 1: Data Structures & OOP',
        duration: '14 hrs',
        lessons: [
          {
            id: 'py-l1',
            title: '1.1 Advanced Python Decorators & Classes',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### Python Custom Decorators
Decorators functions ke behavior ko execute time pe change ya enhance karte hain.

### Code Example:
\`\`\`python
import time

def calculate_time(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.6f} seconds")
        return result
    return wrapper

@calculate_time
def complex_data_loop():
    total = sum(x * x for x in range(1000000))
    return total

print(complex_data_loop())
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'java-core',
    title: '10. Java (OOP, Collections & Multithreading)',
    category: 'Programming Languages',
    description: 'Java programming language complete depth guide. Collections framework, Exception Handling, Multithreading aur Build systems.',
    instructor: 'Sohail Abbas',
    instructorTitle: 'Enterprise Systems Dev',
    duration: '16 hrs',
    rating: 4.7,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Java', 'Multithreading', 'Enterprise'],
    modules: [
      {
        id: 'java-m1',
        title: 'Module 1: Java Collections & Threads',
        duration: '16 hrs',
        lessons: [
          {
            id: 'java-l1',
            title: '1.1 Multithreading & Synchronization',
            duration: '320m',
            completed: false,
            type: 'coding',
            content: `### Java Thread Concurrency
Multiple task ko threads ki support se run karna seekhein aur thread collisions se bachne ke liye synchronization seekhein.

### Code Example:
\`\`\`java
class SafeCounter {
    private int count = 0;
    
    // synchronized keyword prevents race condition
    public synchronized void increment() {
        count++;
    }
    
    public int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        SafeCounter counter = new SafeCounter();
        Thread t1 = new Thread(() -> {
            for(int i=0; i<1000; i++) counter.increment();
        });
        t1.start();
        t1.join();
        System.out.println("Final Count: " + counter.getCount());
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'c-programming',
    title: '11. C (Pointers & Memory Architecture)',
    category: 'Programming Languages',
    description: 'System software development ki core seekhein. Pointers, Dynamic Memory allocations (malloc, calloc), Structs and low-level File I/O.',
    instructor: 'Prof. Jamil',
    instructorTitle: 'Compiler Designer Scientist',
    duration: '11 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['C', 'Memory Management', 'Pointers'],
    modules: [
      {
        id: 'c-m1',
        title: 'Module 1: Memory & Dynamic Allocations',
        duration: '11 hrs',
        lessons: [
          {
            id: 'c-l1',
            title: '1.1 Pointers Arithmetic & malloc',
            duration: '220m',
            completed: false,
            type: 'coding',
            content: `### C Language Memory Allocation
C mein program runtime pe heap memory allocate karna, pointers ka handle karna aur memory leakage se bachna seekhein.

### Code Example:
\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr;
    int size = 5;
    
    // Allocate dynamic heap memory for 5 integers
    arr = (int*) malloc(size * sizeof(int));
    
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }
    
    for(int i = 0; i < size; i++) {
        arr[i] = (i + 1) * 10;
        printf("Value at index %d: %d\\n", i, arr[i]);
    }
    
    // Always free allocated heap memory to avoid memory leak
    free(arr);
    return 0;
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'cpp-programming',
    title: '12. C++ (STL & Object Oriented)',
    category: 'Programming Languages',
    description: 'Standard Template Library (STL), memory optimizations, class templates, competitive template styles aur optimized structures.',
    instructor: 'Khizar Hayat',
    instructorTitle: 'Competitive Programmer Coach',
    duration: '13 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['C++', 'STL', 'Competitive'],
    modules: [
      {
        id: 'cpp-m1',
        title: 'Module 1: Advanced C++ STL Patterns',
        duration: '13 hrs',
        lessons: [
          {
            id: 'cpp-l1',
            title: '1.1 Standard Template Library (Vectors, Maps)',
            duration: '260m',
            completed: false,
            type: 'coding',
            content: `### C++ STL Vector & Map Collections
STL structures optimize algorithm runtime capabilities ko expand karti hain.

### Code Example:
\`\`\`cpp
#include <iostream>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;

int main() {
    // Highly efficient dynamic array
    vector<int> numbers = {5, 2, 8, 1, 9};
    sort(numbers.begin(), numbers.end());
    
    // Map with O(log N) lookup complexity
    map<string, int> userPoints;
    userPoints["dastgeer"] = 450;
    userPoints["sabtech"] = 1200;
    
    for(int n : numbers) {
        cout << n << " ";
    }
    cout << "\\nPoints: " << userPoints["sabtech"] << endl;
    return 0;
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'csharp-dotnet',
    title: '13. C# (.NET Core Framework)',
    category: 'Programming Languages',
    description: '.NET developer banein. ASP.NET architectures, Language Integrated Queries (LINQ), OOP frameworks aur database integrations.',
    instructor: 'Waseem Arshad',
    instructorTitle: 'Senior .NET Consultant',
    duration: '10 hrs',
    rating: 4.6,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['C#', '.NET', 'LINQ'],
    modules: [
      {
        id: 'cs-m1',
        title: 'Module 1: LINQ Queries & OOP Patterns',
        duration: '10 hrs',
        lessons: [
          {
            id: 'cs-l1',
            title: '1.1 Modern LINQ Filters & Expressions',
            duration: '200m',
            completed: false,
            type: 'coding',
            content: `### LINQ (Language Integrated Query)
LINQ hamare databases aur lists ko handle karne ke operations ko extreme short, readable, aur declarative banata hai.

### Code Example:
\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program {
    public static void Main() {
        List<int> scoreBoard = new List<int> { 89, 92, 45, 60, 78, 99 };
        
        // Complex filter using LINQ Expression
        var highScores = scoreBoard
                            .Where(score => score >= 80)
                            .OrderByDescending(score => score);
                            
        foreach (var score in highScores) {
            Console.WriteLine("Elite score: " + score);
        }
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'php-backend',
    title: '14. PHP (Forms & Secure Database)',
    category: 'Programming Languages',
    description: 'Dynamic sites banana seekhein. Form sanitizations, sessions state tracking, PDO connections aur PHP template design.',
    instructor: 'Faisal Mehmood',
    instructorTitle: 'Full-Stack Developer',
    duration: '9 hrs',
    rating: 4.6,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['PHP', 'Backend Web', 'MySQL PDO'],
    modules: [
      {
        id: 'php-m1',
        title: 'Module 1: Secure Form Handling & PDO',
        duration: '9 hrs',
        lessons: [
          {
            id: 'php-l1',
            title: '1.1 Secure Database Access using PHP PDO',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### Secure MySQL Connections in PHP
Prepare statements dynamically SQL Injections security vulnerabilities se system safeguard karti hain.

### Code Example:
\`\`\`php
<?php
$host = 'localhost';
$db   = 'sab_tech_database';
$user = 'root';
$pass = 'secured_password';
$dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // Prepare Statement (Prevents SQL injection)
    $stmt = $pdo->prepare('SELECT id, name FROM users WHERE points > :min_points');
    $stmt->execute(['min_points' => 500]);
    
    while ($row = $stmt->fetch()) {
        echo "User Name: " . htmlspecialchars($row['name']) . "<br>";
    }
} catch (PDOException $e) {
    echo "Connection Error: " . $e->getMessage();
}
?>
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'go-concurrency',
    title: '15. Go (Golang & Microservices)',
    category: 'Programming Languages',
    description: 'Concurrency engines, Goroutines pipelines, Channels communication aur speed optimized microservices servers scale karna seekhein.',
    instructor: 'Arslan Riaz',
    instructorTitle: 'Cloud Infrastructure Dev',
    duration: '9 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Go', 'Concurrency', 'Goroutines'],
    modules: [
      {
        id: 'go-m1',
        title: 'Module 1: Goroutines & Concurrency Model',
        duration: '9 hrs',
        lessons: [
          {
            id: 'go-l1',
            title: '1.1 Channels & Async Routines',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### Concurrency in Golang
Goroutine lightweight thread of execution kehlata hai jo context parameters pe async run hota hai. Channels inke safe path communication ko maintain karte hain.

### Code Example:
\`\`\`go
package main

import (
	"fmt"
	"time"
)

func processTask(id int, ch chan string) {
	time.Sleep(time.Millisecond * 500)
	ch <- fmt.Sprintf("Task %d is fully processed", id)
}

func main() {
	ch := make(chan string)
	
	// Spawning multiple asynchronous Goroutines
	for i := 1; i <= 3; i++ {
		go processTask(i, ch)
	}
	
	// Collect channel values
	for i := 1; i <= 3; i++ {
		fmt.Println(<-ch)
	}
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'rust-ownership',
    title: '16. Rust (System Memory & Safety)',
    category: 'Programming Languages',
    description: 'System programming without garbage collector. Borrow Checker, ownership, pattern matching, dynamic safety standards.',
    instructor: 'Ameer Hamza',
    instructorTitle: 'Systems programmer',
    duration: '12 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Rust', 'Borrow Checker', 'Systems'],
    modules: [
      {
        id: 'rust-m1',
        title: 'Module 1: Ownership & Borrowing Rule Engine',
        duration: '12 hrs',
        lessons: [
          {
            id: 'rust-l1',
            title: '1.1 The Borrow Checker & Pattern Matching',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### Rust Ownership Rules
Rust memory memory allocation rules dynamic pointers safe reference constraints ko follow karta hai:
1. Rust mein har value ka ek variable owner hota hai.
2. Ek time pe sirf ek hi owner ho sakta hai.
3. Jab owner scope se bahar jata hai, value automatically drop ho jati hai.

### Code Example:
\`\`\`rust
fn main() {
    let s1 = String::from("Sab Technologies");
    
    // s1 ownership moves to s2
    let s2 = s1; 
    
    // println!("{}", s1); // This would crash the compiler! Safe!
    
    // We borrow s2 by passing reference
    let len = calculate_length(&s2);
    println!("Length of '{}' is {}", s2, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'kotlin-mobile',
    title: '17. Kotlin (Android & Modern Systems)',
    category: 'Programming Languages',
    description: 'Null-safety system architecture, mobile layouts development, Kotlin flow coroutines async processes integration.',
    instructor: 'Bilal Malik',
    instructorTitle: 'Principal Android Developer',
    duration: '8 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Kotlin', 'Android', 'Null-Safety'],
    modules: [
      {
        id: 'kot-m1',
        title: 'Module 1: Null-Safety & Coroutines API',
        duration: '8 hrs',
        lessons: [
          {
            id: 'kot-l1',
            title: '1.1 Null Safety & Kotlin Coroutines async processes',
            duration: '160m',
            completed: false,
            type: 'coding',
            content: `### Null Safety & Coroutines in Kotlin
Kotlin NullPointerException error compile level pe fix karta hai, jab ke light execution coroutines asynchronous network speed improve karti hain.

### Code Example:
\`\`\`kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    // Null safety syntax
    var username: String? = null
    // System prevents direct access: username.length would fail
    println(username?.length ?: "Default: Username is empty")
    
    // Launch dynamic async task
    launch {
        delay(1000L)
        println("Asynchronous Coroutine execution finished!")
    }
    println("Main block is continue running...")
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'swift-ios',
    title: '18. Swift (SwiftUI & iOS Essentials)',
    category: 'Programming Languages',
    description: 'Apple Ecosystem programming. Closures expressions, protocols configurations, SwiftUI structures development.',
    instructor: 'Saad Ali',
    instructorTitle: 'iOS Dev Lead',
    duration: '8 hrs',
    rating: 4.7,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Swift', 'iOS', 'SwiftUI'],
    modules: [
      {
        id: 'swift-m1',
        title: 'Module 1: SwiftUI Declarative Frameworks',
        duration: '8 hrs',
        lessons: [
          {
            id: 'swift-l1',
            title: '1.1 Views UI Structures & Declarations',
            duration: '160m',
            completed: false,
            type: 'coding',
            content: `### SwiftUI Declarative UI Development
Declarative programming interfaces coding load decrease karte hain.

### Code Example:
\`\`\`swift
import SwiftUI

struct WelcomeView: View {
    @State private var clicksCount = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Sab Technologies iOS Course")
                .font(.headline)
                .foregroundColor(.orange)
            
            Button(action: {
                self.clicksCount += 1
            }) {
                Text("Tap me. Count: \\(clicksCount)")
                    .padding()
                    .background(Color.black)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
        }
        .padding()
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'r-data-analysis',
    title: '19. R (Statistical Computing & ggplot2)',
    category: 'Programming Languages',
    description: 'Data analytics and statistics tool. ggplot2 beautiful layouts, dplyr filters, tables calculations.',
    instructor: 'Dr. Maria',
    instructorTitle: 'Data Analyst Professor',
    duration: '6 hrs',
    rating: 4.5,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['R', 'ggplot2', 'Statistics'],
    modules: [
      {
        id: 'r-m1',
        title: 'Module 1: dplyr Filters & ggplot2 plotting',
        duration: '6 hrs',
        lessons: [
          {
            id: 'r-l1',
            title: '1.1 Statistical Dataframes plotting',
            duration: '120m',
            completed: false,
            type: 'coding',
            content: `### Data manipulation & plotting in R
Data visualization strategies statistics models key analysis support karti hain.

### Code Example:
\`\`\`R
# Load libraries
library(dplyr)
library(ggplot2)

# Create mock database
students_data <- data.frame(
  name = c("Dastgeer", "SabTech", "Ali", "Zainab"),
  score = c(95, 88, 72, 91),
  hours_studied = c(12, 10, 6, 9)
)

# Filter students with dplyr
high_performers <- students_data %>% 
  filter(score >= 80)

# Print high score table
print(high_performers)

# Plotting graph with ggplot2
ggplot(students_data, aes(x=hours_studied, y=score)) +
  geom_point(color="orange", size=4) +
  theme_minimal() +
  labs(title="Study Hours vs Score Index")
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'bash-scripting',
    title: '20. Bash (Linux Shell & Automation)',
    category: 'Programming Languages',
    description: 'Shell commands, directory navigation filters, variables scripting, cron jobs system automation guides.',
    instructor: 'Nabeel Qureshi',
    instructorTitle: 'DevOps & Systems Lead',
    duration: '7 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Bash', 'Linux', 'Automation'],
    modules: [
      {
        id: 'bash-m1',
        title: 'Module 1: Bash Loops, Scripts & Cron Jobs',
        duration: '7 hrs',
        lessons: [
          {
            id: 'bash-l1',
            title: '1.1 Automation scripting & system grep filters',
            duration: '140m',
            completed: false,
            type: 'coding',
            content: `### Bash Scripting for Systems Automation
Automatic scripts backups create, folders monitoring, log parsing simple patterns perform karte hain.

### Code Example:
\`\`\`bash
#!/bin/bash

# Simple Automation Backup Script
SOURCE_DIR="./src"
BACKUP_DIR="./backup_logs"

echo "Checking if directory exist..."
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo "Backup directory created."
fi

# Copying files with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" "$SOURCE_DIR"

echo "Database and codebase backup generated successfully at $TIMESTAMP"
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 3: DATABASES ---
  {
    id: 'sql-database',
    title: '21. SQL (Querying & Joins Mastery)',
    category: 'Databases',
    description: 'Relational Database Queries depth seekhein. Inner, Left, Right Joins, Group By, Subqueries aur optimal indexing patterns.',
    instructor: 'Salman Shah',
    instructorTitle: 'DBA lead expert',
    duration: '10 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['SQL', 'Database Schema', 'Joins'],
    modules: [
      {
        id: 'sql-m1',
        title: 'Module 1: Relational Schema Joins & Indexes',
        duration: '10 hrs',
        lessons: [
          {
            id: 'sql-l1',
            title: '1.1 Advanced SQL Joins & Window Functions',
            duration: '200m',
            completed: false,
            type: 'coding',
            content: `### Relational Database Joins & Queries
Tables integration relationships databases data fetching processing speeds build karti hain.

### Code Example:
\`\`\`sql
-- Complex JOIN with aggregations and Group By filters
SELECT 
    u.id AS user_id,
    u.fullName,
    COUNT(p.id) AS total_projects,
    SUM(p.budget) AS total_investment
FROM users u
INNER JOIN projects p ON u.id = p.owner_id
WHERE p.status = 'active'
GROUP BY u.id, u.fullName
HAVING SUM(p.budget) > 50000
ORDER BY total_investment DESC;
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'mysql-administration',
    title: '22. MySQL (Administration & CRUD)',
    category: 'Databases',
    description: 'MySQL server administration, setups configs, CRUD operations, Foreign Key relationships architectures.',
    instructor: 'Osman Malik',
    instructorTitle: 'Data Administrator Principal',
    duration: '8 hrs',
    rating: 4.7,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['MySQL', 'CRUD', 'Foreign Key'],
    modules: [
      {
        id: 'mysql-m1',
        title: 'Module 1: Schemas Creations & Administration',
        duration: '8 hrs',
        lessons: [
          {
            id: 'mysql-l1',
            title: '1.1 Foreign Keys constraints CRUD operations',
            duration: '160m',
            completed: false,
            type: 'coding',
            content: `### MySQL Schema Architecture Development
Relational tables integrity checks configurations secure transactional updates.

### Code Example:
\`\`\`sql
-- Table generation with Constraints
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
    enroll_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_name VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'postgresql-advanced',
    title: '23. PostgreSQL (CTEs & Window Functions)',
    category: 'Databases',
    description: 'PostgreSQL advanced tools. Common Table Expressions (CTEs), JSONB formats query optimizations, window functions.',
    instructor: 'Rehan Siddiqui',
    instructorTitle: 'Senior Systems Architect',
    duration: '9 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['PostgreSQL', 'CTEs', 'JSONB'],
    modules: [
      {
        id: 'post-m1',
        title: 'Module 1: Window Functions & Common Table Expressions',
        duration: '9 hrs',
        lessons: [
          {
            id: 'post-l1',
            title: '1.1 Advanced Window Functions & CTE queries',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### CTE & Window Functions in PostgreSQL
Window functions dynamic ranks, cumulative sums compute karte hain background load update kiye bagair.

### Code Example:
\`\`\`sql
-- CTE with Window function to rank student scores in categories
WITH RankedSubmissions AS (
    SELECT 
        student_id,
        course_category,
        exam_score,
        DENSE_RANK() OVER (PARTITION BY course_category ORDER BY exam_score DESC) as rank_index
    FROM exam_submissions
)
SELECT 
    student_id,
    course_category,
    exam_score
FROM RankedSubmissions
WHERE rank_index <= 3; -- Get top 3 students per category
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'mongodb-nosql',
    title: '24. MongoDB (Document & Aggregation)',
    category: 'Databases',
    description: 'NoSQL architecture, BSON schemas, Aggregation Pipelines operations, clusters integration setups guides.',
    instructor: 'Bilal Butt',
    instructorTitle: 'NoSQL Engineer Lead',
    duration: '8 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['MongoDB', 'NoSQL', 'Aggregation'],
    modules: [
      {
        id: 'mongo-m1',
        title: 'Module 1: Document Schemas & Complex Aggregations',
        duration: '8 hrs',
        lessons: [
          {
            id: 'mongo-l1',
            title: '1.1 Aggregation Pipeline $match $group pipelines',
            duration: '160m',
            completed: false,
            type: 'coding',
            content: `### MongoDB Aggregation Pipelines
Document filters group integrations analytical summaries dynamically prepare karti hain.

### Code Example:
\`\`\`javascript
// MongoDB Node driver syntax for Aggregations
db.orders.aggregate([
    // Step 1: Filter active status
    { $match: { status: "completed" } },
    
    // Step 2: Group by category and compute stats
    { $group: {
        _id: "$productCategory",
        totalSales: { $sum: "$revenue" },
        averageQuantity: { $avg: "$unitsCount" }
    } },
    
    // Step 3: Sort by totalSales index
    { $sort: { totalSales: -1 } }
]);
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'xml-data-format',
    title: '25. XML (Structure, XPath & Formatting)',
    category: 'Databases',
    description: 'B2B integration data standards. XML validations, XML namespaces, XPath syntax filters, XML schemas (XSD).',
    instructor: 'Yasser Shah',
    instructorTitle: 'Data exchange specialist',
    duration: '5 hrs',
    rating: 4.4,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['XML', 'XPath', 'Data Exchange'],
    modules: [
      {
        id: 'xml-m1',
        title: 'Module 1: XML Schemas XSD & XPath Syntax',
        duration: '5 hrs',
        lessons: [
          {
            id: 'xml-l1',
            title: '1.1 XPath Filters XML validation models',
            duration: '100m',
            completed: false,
            type: 'coding',
            content: `### XML structures & XPath Query Models
XPath selectors document trees hierarchy se target properties direct load evaluate karte hain.

### Code Example:
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book category="programming">
        <title lang="ur">Sab Technologies Guide</title>
        <author>Dastgeer</author>
        <price>49.99</price>
    </book>
</bookstore>
\`\`\`

### XPath Queries:
- \`/bookstore/book[1]/title\` : Fetch first title
- \`//price[text() > 30]\` : Select price nodes above 30
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 4: FRONTEND FRAMEWORKS/LIBRARIES ---
  {
    id: 'jquery-library',
    title: '26. jQuery (DOM, Events & AJAX)',
    category: 'Frontend Frameworks',
    description: 'Legacy web integrations. jQuery selectors, DOM modifications elements, events handling, background AJAX fetch requests.',
    instructor: 'Kamran Ali',
    instructorTitle: 'Web Systems Legacy Engineer',
    duration: '5 hrs',
    rating: 4.4,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['jQuery', 'DOM', 'AJAX'],
    modules: [
      {
        id: 'jq-m1',
        title: 'Module 1: Selectors & AJAX API calls',
        duration: '5 hrs',
        lessons: [
          {
            id: 'jq-l1',
            title: '1.1 Selectors Events trigger & dynamic AJAX API',
            duration: '100m',
            completed: false,
            type: 'coding',
            content: `### jQuery Framework
Short scripts structure multi JS codes workload compress kar deti hai.

### Code Example:
\`\`\`javascript
// Document ready state
$(document).ready(function() {
    // Dynamic click listener
    $("#btn-load-data").click(function() {
        $(".status-box").text("Loading content...");
        
        // Quick AJAX request
        $.ajax({
            url: "/api/courses",
            type: "GET",
            success: function(data) {
                $(".status-box").html("Loaded " + data.length + " items successfully.");
            },
            error: function(err) {
                $(".status-box").text("Fail loading data.");
            }
        });
    });
});
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'react-framework',
    title: '27. React (Components, State & Hooks)',
    category: 'Frontend Frameworks',
    description: 'Modern single page apps engine. Virtual DOM, components cycles, hooks (useState, useEffect, useContext), custom router, state management.',
    instructor: 'Dastgeer Jutt',
    instructorTitle: 'Principal React Architect',
    duration: '16 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['React', 'Hooks', 'Virtual DOM', 'Redux'],
    modules: [
      {
        id: 'react-m1',
        title: 'Module 1: React Functional Components & Hooks',
        duration: '8 hrs',
        lessons: [
          {
            id: 'react-l1',
            title: '1.1 Hooks Deep Dive (State & Effects Engines)',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### React Hooks Engine
React hooks (useState, useEffect, useContext) UI states updates cycles synchronizations coordinate karte hain.

### Code Example:
\`\`\`jsx
import React, { useState, useEffect } from 'react';

export default function CounterDashboard() {
    const [points, setPoints] = useState(100);
    
    useEffect(() => {
        console.log("Stats calculated. Current Points: " + points);
        document.title = \`Score: \${points}\`;
    }, [points]); // Run only when points update
    
    return (
        <div className="p-6 bg-slate-900 text-white rounded-2xl text-center shadow-xl">
            <h2 className="text-lg font-bold text-orange-500">Sab Technologies Reactor</h2>
            <p className="my-4 text-sm">Gamified Points: {points}</p>
            <button 
                onClick={() => setPoints(prev => prev + 50)}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-black transition"
            >
                Add 50 XP
            </button>
        </div>
    );
}
\`\`\``
          }
        ]
      },
      {
        id: 'react-m2',
        title: 'Module 2: Enterprise State Management',
        duration: '8 hrs',
        lessons: [
          {
            id: 'react-l2',
            title: '2.1 Zustand / Redux state flows patterns',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### Zustand Global State Store
Lightweight global store configuration framework patterns coordinates.

### Code Example:
\`\`\`javascript
import { create } from 'zustand';

// Generate safe global state store
export const useAuthStore = create((set) => ({
    userProfile: null,
    isAuthenticated: false,
    login: (profile) => set({ userProfile: profile, isAuthenticated: true }),
    logout: () => set({ userProfile: null, isAuthenticated: false })
}));
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'vue-framework',
    title: '28. Vue (Directives & Composition API)',
    category: 'Frontend Frameworks',
    description: 'Vue.js progressive framework layouts. Template directives, Composition API models, Pinia state stores setups.',
    instructor: 'Sheraz Mughal',
    instructorTitle: 'Frontend Engineer Expert',
    duration: '11 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Vue', 'Composition API', 'Pinia'],
    modules: [
      {
        id: 'vue-m1',
        title: 'Module 1: Vue templates & Composition structures',
        duration: '11 hrs',
        lessons: [
          {
            id: 'vue-l1',
            title: '1.1 Composition API ref reactive systems',
            duration: '220m',
            completed: false,
            type: 'coding',
            content: `### Vue Composition API
Vue 3 Composition API setup methods variable reactive track updates automate karte hain.

### Code Example:
\`\`\`html
<script setup>
import { ref, onMounted } from 'vue';

const count = ref(0);
const studentName = ref('Dastgeer Jutt');

function increment() {
    count.value++;
}

onMounted(() => {
    console.log("Vue framework component mounted.");
});
</script>

<template>
  <div class="vue-card p-4 border border-emerald-500 rounded-xl">
    <h3>Developer: {{ studentName }}</h3>
    <button @click="increment" class="bg-emerald-600 px-4 py-2 text-white">
      Click Index: {{ count }}
    </button>
  </div>
</template>
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'angular-framework',
    title: '29. Angular (TypeScript, Modules & Forms)',
    category: 'Frontend Frameworks',
    description: 'Enterprise structural apps development. Angular components, dependency injection design patterns, reactive forms setups.',
    instructor: 'Amanullah Khan',
    instructorTitle: 'Senior Angular Specialist',
    duration: '13 hrs',
    rating: 4.7,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Angular', 'TypeScript', 'Reactive Forms'],
    modules: [
      {
        id: 'ang-m1',
        title: 'Module 1: TypeScript Services & Reactive Forms',
        duration: '13 hrs',
        lessons: [
          {
            id: 'ang-l1',
            title: '1.1 Components & Forms structure development',
            duration: '260m',
            completed: false,
            type: 'coding',
            content: `### Angular Dependency Injection & Components
Angular strict architectural controls, services declarations modules dependencies inject pipelines configure karte hain.

### Code Example:
\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enroll-form',
  template: \`
    <form [formGroup]="enrollForm" (ngSubmit)="submit()">
      <input formControlName="email" type="email" placeholder="Enter email">
      <button [disabled]="enrollForm.invalid">Register</button>
    </form>
  \`
})
export class EnrollFormComponent implements OnInit {
  enrollForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.enrollForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    console.log("Enrollment email payload: ", this.enrollForm.value);
  }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'angularjs-legacy',
    title: '30. AngularJS (Legacy MVC Framework)',
    category: 'Frontend Frameworks',
    description: 'Legacy codebases audit tools. Controllers scope binds, legacy services directives models mapping.',
    instructor: 'Imran Shah',
    instructorTitle: 'Legacy Systems Auditor',
    duration: '4 hrs',
    rating: 4.1,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['AngularJS', 'Legacy MVC', 'Scope'],
    modules: [
      {
        id: 'ajs-m1',
        title: 'Module 1: Scope variables & Controllers MVC',
        duration: '4 hrs',
        lessons: [
          {
            id: 'ajs-l1',
            title: '1.1 Legacy code handling model structures',
            duration: '80m',
            completed: false,
            type: 'coding',
            content: `### AngularJS legacy architecture model
Legacy enterprise migration models handling strategies.

### Code Example:
\`\`\`javascript
// Legacy AngularJS controller code
angular.module('sabTechApp', [])
.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.welcomeMessage = "Welcome to legacy module.";
    $scope.points = 120;
    
    $scope.increaseScore = function() {
        $scope.points += 10;
    };
}]);
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'typescript-advanced',
    title: '31. TypeScript (Interfaces & Generics)',
    category: 'Frontend Frameworks',
    description: 'Type safe systems design. Interfaces structural configuration, custom generics types, union & type intersections.',
    instructor: 'Zia-ur-Rehman',
    instructorTitle: 'Core Systems Architect',
    duration: '7 hrs',
    rating: 4.9,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['TypeScript', 'Generics', 'Type-Safety'],
    modules: [
      {
        id: 'ts-m1',
        title: 'Module 1: Generics & Type Constraints',
        duration: '7 hrs',
        lessons: [
          {
            id: 'ts-l1',
            title: '1.1 Advanced Generics & Utility types interfaces',
            duration: '140m',
            completed: false,
            type: 'coding',
            content: `### TypeScript Generics
Generics allow building reusable, highly flexible components that work over a variety of types rather than a single one.

### Code Example:
\`\`\`typescript
interface ApiResponse<T> {
    data: T;
    status: 'success' | 'error';
    timestamp: number;
}

interface UserProfile {
    id: string;
    fullName: string;
    skills: string[];
}

// Generic fetching parser
function parseApiResponse<T>(response: ApiResponse<T>): T {
    if (response.status === 'success') {
        return response.data;
    }
    throw new Error("Server query payload broken!");
}

// Usage Example
const userPayload: ApiResponse<UserProfile> = {
    data: { id: "101", fullName: "Dastgeer Jutt", skills: ["React", "TypeScript"] },
    status: 'success',
    timestamp: Date.now()
};

const user = parseApiResponse(userPayload);
console.log(user.fullName.toUpperCase()); // Safe auto complete
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 5: BACKEND & FULL STACK ---
  {
    id: 'nodejs-api',
    title: '32. NodeJS (Express REST APIs)',
    category: 'Backend & Full Stack',
    description: 'Fast robust backends building. Express controllers, file system async, REST patterns operations, databases queries integrations.',
    instructor: 'Irfan Sheikh',
    instructorTitle: 'Staff Backend Architect',
    duration: '11 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['NodeJS', 'Express', 'APIs', 'JWT'],
    modules: [
      {
        id: 'node-m1',
        title: 'Module 1: REST Controllers & Auth Middlewares',
        duration: '11 hrs',
        lessons: [
          {
            id: 'node-l1',
            title: '1.1 JWT Security & REST Controllers systems',
            duration: '220m',
            completed: false,
            type: 'coding',
            content: `### Node Express API Routing with Middleware
JWT verification middleware routes safety ensure karta hai.

### Code Example:
\`\`\`javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// Token validation middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Access token missing" });
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Token expired or invalid" });
        req.user = user;
        next();
    });
};

app.get('/api/secure-profile', authenticateToken, (req, res) => {
    res.json({ message: "Welcome to dashboard", userId: req.user.id });
});
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'django-framework',
    title: '33. Django (Python web & Django ORM)',
    category: 'Backend & Full Stack',
    description: 'Python web applications design. Django Models, ORM engines queries, REST Framework web integrations APIs.',
    instructor: 'Adeel Chaudhry',
    instructorTitle: 'Django Consultant Lead',
    duration: '12 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Django', 'Python', 'ORM', 'APIs'],
    modules: [
      {
        id: 'django-m1',
        title: 'Module 1: Django Models & DRF Serializers',
        duration: '12 hrs',
        lessons: [
          {
            id: 'django-l1',
            title: '1.1 Models configuration DRF serializer pipelines',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### Django REST Framework API Serializations
Django ORM database migrations and tables queries models.

### Code Example:
\`\`\`python
# models.py
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

# serializers.py
from rest_framework import serializers

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'budget', 'created_at']
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'asp-dotnet-web',
    title: '34. ASP (ASP.NET Web MVC & API)',
    category: 'Backend & Full Stack',
    description: 'Microsoft backend development ecosystem. MVC system architectures, REST controllers, Entity Framework database ORM patterns.',
    instructor: 'Khram Shahzad',
    instructorTitle: 'Senior Enterprise Architect',
    duration: '10 hrs',
    rating: 4.6,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['ASP.NET', 'MVC', 'Entity Framework'],
    modules: [
      {
        id: 'asp-m1',
        title: 'Module 1: Controllers web routing & Entity context',
        duration: '10 hrs',
        lessons: [
          {
            id: 'asp-l1',
            title: '1.1 Entity Framework database migrations models',
            duration: '200m',
            completed: false,
            type: 'coding',
            content: `### Entity Framework database migrations structures
Database connections and query contexts mapping.

### Code Example:
\`\`\`csharp
using Microsoft.EntityFrameworkCore;

public class Student {
    public int Id { get; set; }
    public string FullName { get; set; }
    public int Score { get; set; }
}

public class AppDbContext : DbContext {
    public DbSet<Student> Students { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder options) {
        options.UseSqlServer("Server=localhost;Database=SabTechDB;Trusted_Connection=True;");
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'git-version-control',
    title: '35. Git (Branches, Merging & workflows)',
    category: 'Backend & Full Stack',
    description: 'Collaborative development pipelines. Branches, merging strategies, resolving conflicts, rebase models.',
    instructor: 'Asif Nadeem',
    instructorTitle: 'DevSecOps Manager',
    duration: '6 hrs',
    rating: 4.8,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['Git', 'Version Control', 'Workflow'],
    modules: [
      {
        id: 'git-m1',
        title: 'Module 1: Commit, Branches & Conflict Resolution',
        duration: '6 hrs',
        lessons: [
          {
            id: 'git-l1',
            title: '1.1 Branches merge rebasing workflows',
            duration: '120m',
            completed: false,
            type: 'coding',
            content: `### Advanced Git Commands
Collaborative team workflows setup rules.

### Essential Workflow Commands:
\`\`\`bash
# Create and switch to new feature branch
git checkout -b feature/sab-tech-courses

# Stage all files
git add .

# Safe commit
git commit -m "feat: integrate courses roadmap and lesson details"

# Push to server
git push origin feature/sab-tech-courses

# Interactive Rebase (squash commits)
git rebase -i HEAD~3
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 6: DATA SCIENCE, AI & PYTHON ECOSYSTEM ---
  {
    id: 'numpy-computing',
    title: '36. NumPy (Mathematical Computing)',
    category: 'Data Science & AI',
    description: 'Python scientific computing. Arrays creation, slice indexing operations, linear algebra vectors broadcasting.',
    instructor: 'Dr. Sajid',
    instructorTitle: 'Mathematical Computations PhD',
    duration: '5 hrs',
    rating: 4.7,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['NumPy', 'Arrays', 'Math Computing'],
    modules: [
      {
        id: 'num-m1',
        title: 'Module 1: Matrix arrays broadcasting & vectors',
        duration: '5 hrs',
        lessons: [
          {
            id: 'num-l1',
            title: '1.1 Dynamic multi-dimensional array math matrixes',
            duration: '100m',
            completed: false,
            type: 'coding',
            content: `### High-speed operations with NumPy arrays
NumPy arrays matrix computing algorithms processing rates extend speed constraints.

### Code Example:
\`\`\`python
import numpy as np

# 2D Matrix Grid array
matrix_a = np.array([[1, 2], [3, 4]])
matrix_b = np.array([[5, 6], [7, 8]])

# High speed element-wise multiplication
multiplied = matrix_a * matrix_b

# Dot product calculations
dot_product = np.dot(matrix_a, matrix_b)

print("Dot Product Output Grid:\\n", dot_product)
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'pandas-analysis',
    title: '37. Pandas (DataFrames & Cleaning)',
    category: 'Data Science & AI',
    description: 'Data analytics pipelines. Series, DataFrames manipulations, missing values cleanup, data merges, datasets filters.',
    instructor: 'Sarah Butt',
    instructorTitle: 'AI Research Scientist',
    duration: '7 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['Pandas', 'DataFrames', 'Data Cleaning'],
    modules: [
      {
        id: 'pan-m1',
        title: 'Module 1: Dataframes filters cleaning & files IO',
        duration: '7 hrs',
        lessons: [
          {
            id: 'pan-l1',
            title: '1.1 Missing values filters files loading integrations',
            duration: '140m',
            completed: false,
            type: 'coding',
            content: `### Pandas DataFrame Operations
Data cleaning, filters, groups calculations.

### Code Example:
\`\`\`python
import pandas as pd

# Load dataset CSV file
# df = pd.read_csv('students_data.csv')

# Mock DataFrame Creation
data = {
    'Student': ['Dastgeer', 'Ali', None, 'Zainab'],
    'Score': [95, 78, 62, None],
    'Status': ['Pass', 'Pass', 'Fail', 'Pass']
}
df = pd.DataFrame(data)

# 1. Fill missing numeric values with column mean index
df['Score'] = df['Score'].fillna(df['Score'].mean())

# 2. Drop rows where critical info is missing
df = df.dropna(subset=['Student'])

print(df)
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'scipy-optimization',
    title: '38. SciPy (Scientific & Optimizations)',
    category: 'Data Science & AI',
    description: 'Advanced data analytics. Statistics models calculations, functions optimizers algorithms, dynamic signals analyses structures.',
    instructor: 'Prof. Waheed',
    instructorTitle: 'Data Systems PhD',
    duration: '6 hrs',
    rating: 4.6,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['SciPy', 'Optimization', 'Statistics'],
    modules: [
      {
        id: 'sci-m1',
        title: 'Module 1: Mathematical Optimization & Functions Stats',
        duration: '6 hrs',
        lessons: [
          {
            id: 'sci-l1',
            title: '1.1 Scientific functions solvers data integrations',
            duration: '120m',
            completed: false,
            type: 'coding',
            content: `### Mathematical optimizations using SciPy library
Minimizing system cost functions calculations.

### Code Example:
\`\`\`python
import numpy as np
from scipy.optimize import minimize

# Define mathematical quadratic function
def objective_cost(x):
    return x[0]**2 + x[1]**2 + 5

# Initial guess
starting_point = [2.0, 3.0]

# Compute local minimum bounds
result = minimize(objective_cost, starting_point)

print("Optimized point coordinates:", result.x)
print("Minimum cost value found:", result.fun)
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'data-science-roadmap',
    title: '39. Data Science (Exploratory Data Analysis)',
    category: 'Data Science & AI',
    description: 'Data scientist career pathway. Statistics fundamentals, Exploratory Data Analysis, machine learning classifiers setups.',
    instructor: 'Rizwan Qureshi',
    instructorTitle: 'Principal Data Scientist',
    duration: '14 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Data Science', 'EDA', 'Scikit-Learn'],
    modules: [
      {
        id: 'ds-m1',
        title: 'Module 1: Exploratory Data plots & scikit ML Models',
        duration: '14 hrs',
        lessons: [
          {
            id: 'ds-l1',
            title: '1.1 Data plots, ML algorithms models',
            duration: '280m',
            completed: false,
            type: 'coding',
            content: `### Machine learning Model training with Scikit-Learn
Data classifications models build pipelines.

### Code Example:
\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np

# Generate mock classification matrices
X = np.random.rand(100, 4) # 100 samples, 4 features
y = np.random.choice([0, 1], size=100) # Binary classifications

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Instantiate Classifier Model
clf = RandomForestClassifier(n_estimators=50, random_state=42)
clf.fit(X_train, y_train)

# Predictions
predictions = clf.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"RandomForest Model accuracy score index: {accuracy:.4f}")
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'ai-machine-learning',
    title: '40. AI (Neural Networks & PyTorch)',
    category: 'Data Science & AI',
    description: 'AI deep architectures. Neural networks layers, backpropagation calculations, PyTorch frameworks datasets training cycles.',
    instructor: 'Dr. Shahzad',
    instructorTitle: 'AI Research Director',
    duration: '15 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['AI', 'Neural Networks', 'PyTorch'],
    modules: [
      {
        id: 'ai-m1',
        title: 'Module 1: Tensor Math & Neural Network training',
        duration: '15 hrs',
        lessons: [
          {
            id: 'ai-l1',
            title: '1.1 Deep Learning models configurations PyTorch',
            duration: '300m',
            completed: false,
            type: 'coding',
            content: `### Neural Networks definitions in PyTorch
Linear networks structures and optimizations pipelines.

### Code Example:
\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

# Simple feedforward neural network structure
class SabTechClassifier(nn.Module):
    def __init__(self):
        super(SabTechClassifier, self).__init__()
        self.fc1 = nn.Linear(8, 16) # Input: 8 features, hidden: 16 neurons
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(16, 2) # Output: 2 classification labels
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Instantiate model, optimizer and Loss criteria
model = SabTechClassifier()
optimizer = optim.Adam(model.parameters(), lr=0.01)
criterion = nn.CrossEntropyLoss()

print(model)
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'generative-ai',
    title: '41. Gen AI (LLMs, RAG & Agents)',
    category: 'Data Science & AI',
    description: 'Generative AI masterclass. Prompt engineering structures, RAG databases setups, custom AI Agents systems models pipelines.',
    instructor: 'Hamza Khan',
    instructorTitle: 'AI Automation Engineer Lead',
    duration: '15 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['GenAI', 'LLMs', 'RAG', 'LangChain'],
    modules: [
      {
        id: 'gai-m1',
        title: 'Module 1: LLM integrations, RAG & Langchain models',
        duration: '15 hrs',
        lessons: [
          {
            id: 'gai-l1',
            title: '1.1 LLMs prompts setup Vector databases connections',
            duration: '300m',
            completed: false,
            type: 'coding',
            content: `### Gen AI & RAG system architecture
Prompt engineering structure configurations and AI agent pipelines setup.

### Code Example:
\`\`\`javascript
// Server-side Gemini API integration template
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateTechnicalCourseGuide(topic) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: \`Act as an expert computer science teacher. Explain the following topic in extreme details with complete clear code examples: \${topic}\`,
        });
        
        console.log("Gemini Output payload:", response.text);
        return response.text;
    } catch (err) {
        console.error("Gemini system failed query:", err);
    }
}
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 7: CLOUD, DEVOPS & SECURITY ---
  {
    id: 'aws-cloud',
    title: '42. AWS (Cloud Architecture & Deploy)',
    category: 'Cloud & DevOps',
    description: 'Cloud deployment architectures. EC2 server setups, S3 buckets, IAM access keys parameters configurations, Lambda setups.',
    instructor: 'Waqas Ahmed',
    instructorTitle: 'AWS Certified Solutions Architect',
    duration: '12 hrs',
    rating: 4.8,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['AWS', 'EC2', 'S3', 'Cloud-Deploy'],
    modules: [
      {
        id: 'aws-m1',
        title: 'Module 1: IAM configurations, EC2 & AWS S3 buckets',
        duration: '12 hrs',
        lessons: [
          {
            id: 'aws-l1',
            title: '1.1 Server deploys S3 assets permissions',
            duration: '240m',
            completed: false,
            type: 'coding',
            content: `### AWS S3 assets setups with JS SDK
Secure file storage parameters configurations.

### Code Example:
\`\`\`javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function uploadBackupFile(bucketName, fileName, fileContent) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent
    });
    
    try {
        const response = await s3.send(command);
        console.log("File uploaded successfully. ETag:", response.ETag);
    } catch (err) {
        console.error("AWS S3 Upload Fail:", err);
    }
}
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-essentials',
    title: '43. Cybersecurity (OWASP & Threat audits)',
    category: 'Cloud & DevOps',
    description: 'Systems threat management. OWASP Top 10 vulnerabilities testing, dynamic cryptography encryptions, authentication safety.',
    instructor: 'Sheraz Rafique',
    instructorTitle: 'Chief Security Auditor',
    duration: '11 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Cybersecurity', 'OWASP', 'Cryptography'],
    modules: [
      {
        id: 'sec-m1',
        title: 'Module 1: OWASP security assessments & Cryptography',
        duration: '11 hrs',
        lessons: [
          {
            id: 'sec-l1',
            title: '1.1 Passwords hashing algorithms implementations security',
            duration: '220m',
            completed: false,
            type: 'coding',
            content: `### Cybersecurity standard: Secure passwords hashing
Using high quality encryption engines to save critical student databases information.

### Code Example:
\`\`\`javascript
const bcrypt = require('bcrypt');

async function secureUserPassword(plainPassword) {
    const saltRounds = 12; // High complexity cost factor
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log("Hashed Secure Output:", hashedPassword);
        
        // Verify state later during login
        const matches = await bcrypt.compare(plainPassword, hashedPassword);
        console.log("Verification state:", matches); // Returns true
        
        return hashedPassword;
    } catch (err) {
        console.error("Cryptographic processing error:", err);
    }
}
\`\`\``
          }
        ]
      }
    ]
  },

  // --- CATEGORY 8: TOOLS & DATA (EXCEL, DSA) ---
  {
    id: 'excel-automation',
    title: '44. Excel (Formulas & PivotTables)',
    category: 'Tools & DSA',
    description: 'Corporate business logic masterclass. Dynamic Excel formulas, pivot table analysis, graphs visualizations, basic VBA automation macros.',
    instructor: 'Naveed Mughal',
    instructorTitle: 'BI Analyst Consultant',
    duration: '7 hrs',
    rating: 4.7,
    difficulty: 'Beginner',
    enrolled: false,
    progress: 0,
    tags: ['Excel', 'PivotTables', 'VBA'],
    modules: [
      {
        id: 'xl-m1',
        title: 'Module 1: Formulas setups & Pivot tables configurations',
        duration: '7 hrs',
        lessons: [
          {
            id: 'xl-l1',
            title: '1.1 VLOOKUP, INDEX MATCH formulas Pivot reports',
            duration: '140m',
            completed: false,
            type: 'coding',
            content: `### Advanced Excel analytical models
Key formulas layouts setups rules:

1. **VLOOKUP Function**:
   \`=VLOOKUP(target_cell, data_range, column_index, FALSE)\`
   
2. **INDEX MATCH Combined Formula (Powerful alternative)**:
   \`=INDEX(target_column, MATCH(lookup_value, search_column, 0))\`
   
3. **Automated SUMIFS Formula**:
   \`=SUMIFS(sum_range, criteria_range_1, criteria_val_1, criteria_range_2, criteria_val_2)\`

### PivotTables Guides:
- Insert -> PivotTable -> Select range coordinates.
- Drag "Categories" to Rows.
- Drag "Revenue" to Values and select SUM model.
- Drag "Regions" to Columns for matrix reports.
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'dsa-curriculum',
    title: '45. DSA (Data Structures & Algorithms)',
    category: 'Tools & DSA',
    description: 'Elite algorithm problems course. Arrays, trees algorithms, dynamic programming optimizations, complexity checks.',
    instructor: 'Dastgeer Jutt',
    instructorTitle: 'Competitive Algo Coach',
    duration: '18 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['DSA', 'Algorithms', 'Trees', 'Dynamic Programming'],
    modules: [
      {
        id: 'dsa-m1',
        title: 'Module 1: Complexity Checks & Linked List trees algorithms',
        duration: '9 hrs',
        lessons: [
          {
            id: 'dsa-l1',
            title: '1.1 Big-O scales tree nodes recursively traversals',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### Binary tree traversals algorithms in C++
In-order, pre-order recursively nodes traversals.

### Code Example:
\`\`\`cpp
#include <iostream>

using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    
    Node(int val) {
        data = val;
        left = nullptr;
        right = nullptr;
    }
};

// In-order traversal (Left, Root, Right)
void printInOrder(Node* root) {
    if (root == nullptr) return;
    printInOrder(root->left);
    cout << root->data << " -> ";
    printInOrder(root->right);
}

int main() {
    Node* root = new Node(10);
    root->left = new Node(5);
    root->right = new Node(15);
    
    cout << "Binary Tree elements traversal:" << endl;
    printInOrder(root);
    return 0;
}
\`\`\``
          }
        ]
      },
      {
        id: 'dsa-m2',
        title: 'Module 2: Dynamic Programming State Transitions',
        duration: '9 hrs',
        lessons: [
          {
            id: 'dsa-l2',
            title: '2.1 Knapsack problems state transitions memorizations',
            duration: '180m',
            completed: false,
            type: 'coding',
            content: `### 0/1 Knapsack problem using Dynamic Programming
State transition recurrence formula:
\`dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])\`

### Code Example:
\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int solveKnapsack(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}
\`\`\``
          }
        ]
      }
    ]
  }
];

function getModuleTitle(courseTitle: string, moduleIndex: number): string {
  const title = courseTitle.toLowerCase();
  
  if (title.includes('programming') || title.includes('javascript') || title.includes('python') || title.includes('java ') || title.includes('c-programming') || title.includes('cpp') || title.includes('csharp') || title.includes('go-') || title.includes('rust') || title.includes('kotlin') || title.includes('swift') || title.includes('r-data')) {
    const modules = [
      "Module 1: Introduction, Setup & Language Essentials",
      "Module 2: Variables, Data Types & Operations",
      "Module 3: Control Flow & Conditionals",
      "Module 4: Repetitive Statements & Loops",
      "Module 5: Functions, Parameters & Return values",
      "Module 6: Scope, Closures & Memory Mechanics",
      "Module 7: Complex Data Structures & Algorithms",
      "Module 8: Object-Oriented Design & Classes",
      "Module 9: Error Handling, File I/O & Modules",
      "Module 10: Capstone Project & Production Optimization"
    ];
    return modules[moduleIndex - 1];
  }
  
  if (title.includes('database') || title.includes('sql') || title.includes('mysql') || title.includes('postgresql') || title.includes('mongodb') || title.includes('nosql')) {
    const modules = [
      "Module 1: Database Concepts & Data Modeling",
      "Module 2: Server Setup & Client Tools",
      "Module 3: Basic Querying, SELECT & Operators",
      "Module 4: Filtering, Sorting & Null Handling",
      "Module 5: Aggregation, GROUP BY & Functions",
      "Module 6: Relational Algebra & Multi-Table Joins",
      "Module 7: Subqueries, CTEs & Advanced Window Functions",
      "Module 8: Data Definition (DDL) & Schema Alterations",
      "Module 9: Data Manipulation (DML) & Integrity Rules",
      "Module 10: Transactions, Indexes & Database Tuning"
    ];
    return modules[moduleIndex - 1];
  }
  
  if (title.includes('html') || title.includes('css') || title.includes('bootstrap') || title.includes('sass') || title.includes('tailwindcss') || title.includes('react') || title.includes('vue') || title.includes('angular') || title.includes('nodejs') || title.includes('django') || title.includes('asp') || title.includes('php') || title.includes('web')) {
    const modules = [
      "Module 1: Architecture, Protocols & Environment Setup",
      "Module 2: Core Document Structure & Elements",
      "Module 3: Typography & Text Layout Styles",
      "Module 4: Responsive Layouts & Positioning Mechanics",
      "Module 5: Flexbox, Grid & Modern Framework Utilities",
      "Module 6: User Interactivity, Events & Forms",
      "Module 7: Stateful Applications & Component Lifecycles",
      "Module 8: API Integration & Data Fetching Schemes",
      "Module 9: Routing, Auth & State Management Hooks",
      "Module 10: Production Bundling & Cloud Hosting Strategies"
    ];
    return modules[moduleIndex - 1];
  }
  
  const modules = [
    "Module 1: Fundamental Concepts & History",
    "Module 2: Setup, Tools & Workspace Design",
    "Module 3: Core Operations & Syntax Rules",
    "Module 4: Structuring Logic & Clean Code",
    "Module 5: Real-World Applications & Use Cases",
    "Module 6: Intermediate Optimizations",
    "Module 7: Advanced Architectural Design",
    "Module 8: Performance Analysis & Benchmarking",
    "Module 9: Security Guidelines & Debugging",
    "Module 10: Final Industry Capstone Project"
  ];
  return modules[moduleIndex - 1];
}

function getCourseSubject(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('html')) return 'HTML';
  if (t.includes('css')) return 'CSS';
  if (t.includes('javascript') || t.includes('js')) return 'JavaScript';
  if (t.includes('python')) return 'Python';
  if (t.includes('java ') || t.includes('java core')) return 'Java';
  if (t.includes('c++') || t.includes('cpp')) return 'C++';
  if (t.includes('c-programming') || t.includes('c programming')) return 'C';
  if (t.includes('csharp') || t.includes('c#')) return 'C#';
  if (t.includes('php')) return 'PHP';
  if (t.includes('go-') || t.includes('go ')) return 'Go';
  if (t.includes('rust')) return 'Rust';
  if (t.includes('kotlin')) return 'Kotlin';
  if (t.includes('swift')) return 'Swift';
  if (t.includes('sql') || t.includes('mysql') || t.includes('postgresql')) return 'SQL';
  if (t.includes('mongodb')) return 'MongoDB';
  if (t.includes('react')) return 'React';
  if (t.includes('angular')) return 'Angular';
  if (t.includes('vue')) return 'Vue';
  if (t.includes('nodejs') || t.includes('node')) return 'Node.js';
  if (t.includes('django')) return 'Django';
  if (t.includes('git')) return 'Git';
  if (t.includes('dsa')) return 'DSA';
  if (t.includes('machine learning') || t.includes('ai')) return 'AI/ML';
  if (t.includes('data science')) return 'Data Science';
  return 'Programming';
}

function getLessonTitle(subject: string, moduleIndex: number, lessonIndex: number): string {
  const lessonNum = `${moduleIndex}.${lessonIndex}`;
  
  if (subject === 'HTML' || subject === 'CSS' || subject === 'React' || subject === 'Angular' || subject === 'Vue' || subject === 'Node.js' || subject === 'Django' || subject === 'Git') {
    const topics: Record<number, string[]> = {
      1: ["History and Core Engine", "First Setup & Terminal Tools", "Directory Configuration", "Initial Scaffolding", "CLI Command Guides", "Basic File Formats", "First Hello World Render", "Understanding Compilers/Browsers", "Modern DevTools Inspection", "Troubleshooting Common Setup Issues"],
      2: ["Core Syntax & Base Tags", "Document Metadata Structure", "Configuring Global Schemas", "Attributes and Properties", "Working with text elements", "Injecting external links", "Image and media loading", "Embedding inline elements", "Layout containers & division", "Validating standards & compliance"],
      3: ["Basic Typography styles", "Web Fonts Integration", "Alignment & line-height spacing", "Color theory & palette choices", "Theme declarations & presets", "Text decoration & shadows", "Managing negative space", "Grouping lists & items", "Flow layouts & readability", "Design guidelines for typography"],
      4: ["Visual Box Model rules", "Margin vs Padding spacing", "Border designs & curves", "Sizing elements (width/height)", "Position values (relative/absolute)", "Z-index layer mechanics", "Floating & clearing elements", "Display properties (inline/block)", "Overflow strategies", "Responsive layout break-points"],
      5: ["Introduction to Flexbox flow", "Justifying flex containers", "Aligning flex items", "Flex wrap & ordering", "Grid Layout fundamentals", "Configuring grid tracks", "Placing grid items", "Grid template areas", "Gap spacing & auto-fits", "Combining Flex & Grid systems"],
      6: ["Interactive UI features", "Triggering DOM/Style events", "Creating input fields", "Developing rich forms", "Form validations & feedback", "Working with buttons & labels", "Configuring focus outlines", "Accessibility (ARIA) guidelines", "Keyboard navigation support", "Designing intuitive controls"],
      7: ["State and lifecycle concepts", "Creating reusable elements", "Component nesting strategies", "Property passing & rendering", "Local state management hooks", "Updating view templates", "Dynamic list rendering", "Conditional blocks in layout", "Refactoring into sub-components", "Optimal performance updates"],
      8: ["Understanding HTTP & REST", "Data Fetching essentials", "JSON parsing techniques", "Async/Await API structures", "Displaying loaded data", "Handling loading indicators", "Managing API errors", "Optimizing data cache", "Pagination & infinite scroll", "Real-time updates with APIs"],
      9: ["Designing multi-page routing", "Dynamic route parameters", "Protecting private paths", "State distribution models", "Global state store hooks", "User authentication flow", "Saving login sessions", "Optimizing state updates", "Reducers and actions patterns", "Syncing state with LocalStorage"],
      10: ["Building optimized assets", "Production minification", "Code splitting & lazy loading", "Environment configurations", "Configuring hosting servers", "Setting up continuous delivery", "Speed diagnostics & scores", "SEO optimizations", "Security vulnerability checks", "Final project showcase & review"]
    };
    const list = topics[moduleIndex] || topics[1];
    return `${lessonNum} ${list[lessonIndex - 1]}`;
  }
  
  if (subject === 'SQL' || subject === 'MongoDB') {
    const topics: Record<number, string[]> = {
      1: ["Introduction to Data Modeling", "Relational vs Document concepts", "ER Diagram foundations", "Designing robust schemas", "Primary & Foreign keys", "One-to-Many configurations", "Many-to-Many design patterns", "Data normalization rules", "Understanding Denormalization", "Schema design best practices"],
      2: ["Database engine installation", "Configuring local ports & users", "Command-line clients guide", "Interactive GUI dashboards", "Connection strings syntax", "Establishing remote sessions", "Database creation scripts", "Securing access credentials", "Troubleshooting initial boots", "Admin monitoring consoles"],
      3: ["First SELECT Query syntax", "Retrieving precise columns", "Renaming output with Aliases", "Eliminating duplicates with DISTINCT", "Basic arithmetic operations", "Handling system functions", "Concatenating output values", "Conditional expression logic", "Working with date/time outputs", "Query formatting standards"],
      4: ["Filtering with WHERE constraints", "Logical operators AND & OR", "Range selections with BETWEEN", "Value lists with IN filters", "Wildcard matches with LIKE", "Filtering empty NULL values", "Sorting results with ORDER BY", "Limiting outputs with LIMIT", "Skipping rows with OFFSET", "Writing clean search criteria"],
      5: ["COUNT aggregation syntax", "Calculating totals with SUM", "Finding averages with AVG", "Retrieving extremes (MIN/MAX)", "Grouping with GROUP BY", "Filtering groups with HAVING", "Counting distinct occurrences", "Combining multiple aggregations", "Grouping across date ranges", "Aggregating nested structures"],
      6: ["Relational Algebra basics", "Mastering INNER JOIN", "Using LEFT outer joins", "Leveraging RIGHT outer joins", "Complete FULL OUTER JOIN", "Self Joins concepts", "Cross Joins & Cartesian results", "Combining multiple table links", "Filtering joined table values", "Alias rules for clean Joins"],
      7: ["Understanding Subqueries", "Nested SELECT statements", "Correlated subqueries", "EXISTS and NOT EXISTS", "Introduction to CTEs", "Recursive CTE designs", "Window function basics", "Partitioning results with OVER", "Ranking with ROW_NUMBER", "Running totals & averages"],
      8: ["CREATE TABLE instructions", "Configuring data constraints", "ALTER TABLE operations", "DROP and TRUNCATE differences", "Managing data indexes", "Configuring unique indexes", "Foreign Key integrity constraints", "Creating virtual VIEWS", "Designing system schemas", "DDL script organization"],
      9: ["INSERT INTO statements", "Bulk loading data records", "UPDATE commands guidelines", "Safe updating with filters", "DELETE FROM procedures", "Upsert operations (Merge)", "Bulk import from CSV files", "Exporting data schemas", "Validating raw data inputs", "Managing data anomalies"],
      10: ["ACID transaction properties", "START TRANSACTION commands", "Saving changes with COMMIT", "Reverting with ROLLBACK", "Understanding locks & deadlocks", "Query plan analysis", "Index optimization strategies", "Database backup procedures", "Restoring from system backups", "Final database tuning checklist"]
    };
    const list = topics[moduleIndex] || topics[1];
    return `${lessonNum} ${list[lessonIndex - 1]}`;
  }

  const topics: Record<number, string[]> = {
    1: ["History and environment setup", "CLI commands & Compilation", "Your first Hello World", "Outputting data to console", "Comments and documentation", "Syntax rules & semicolons", "IDE shortcuts and plugins", "Troubleshooting basic build errors", "Working with interpreter/compiler", "Memory allocation basics"],
    2: ["Declaring variables properly", "Integer & Float data types", "Character & String data types", "Boolean flag variables", "Type conversion (casting)", "Arithmetic operators", "Relational and logic operators", "Bitwise operators in action", "Operator precedence guides", "Constant values & immutability"],
    3: ["If and Else statements", "Else-If ladder configurations", "Nested conditional checks", "Logical operators in conditions", "Switch/Match case statements", "Ternary operator syntax", "Short-circuit evaluation rules", "Designing decision flow charts", "Handling boundary comparisons", "Conditional optimization guides"],
    4: ["Understanding loop mechanics", "Designing For Loops", "Iterating with While Loops", "Do-While loop configurations", "Infinite loops & prevention", "Breaking loops with break", "Skipping loops with continue", "Nested loop configurations", "Looping through text arrays", "Performance of loops in memory"],
    5: ["Declaring reusable functions", "Parameters and arguments", "Pass-by-value vs Reference", "Returning single output values", "Returning multiple values", "Default parameter definitions", "Overloading function names", "Inline and lambda helpers", "Recursion basic concepts", "Designing clean modular code"],
    6: ["Understanding memory stacks", "Global vs Local variables", "Block scope boundaries", "Variable lifetime rules", "Understanding Closures", "Pass-by-reference memory", "Pointer basics introduction", "Garbage collection mechanics", "Memory leak diagnostic tools", "Optimizing scope references"],
    7: ["Intro to lists & arrays", "Dynamic resizing arrays", "Two-dimensional matrices", "Stack data structure basics", "Queue data structure basics", "Singly Linked List concepts", "Key-Value dictionaries/maps", "Set elements & uniqueness", "Searching values in arrays", "Basic sorting algorithms"],
    8: ["Introduction to OOP design", "Defining custom Classes", "Instantiating new Objects", "Encapsulation & Private fields", "Constructor initialization", "Implementing Inheritance", "Polymorphism & Method overrides", "Abstract classes & Interfaces", "Static methods and properties", "Object-oriented best practices"],
    9: ["Catching runtime Exceptions", "Using Try, Catch & Finally", "Throwing custom errors", "Validating input parameters", "Reading external text files", "Writing data to disk files", "Importing system libraries", "Creating custom packages", "Asset paths configuration", "Logging error diagnostics"],
    10: ["Designing modular projects", "System requirements analysis", "Structuring project modules", "Writing clean automated tests", "Debugging techniques with breakpoints", "Time complexity analysis (Big O)", "Optimizing memory footprints", "Building executable packages", "Code reviews and best guidelines", "Final capstone project review"]
  };
  const list = topics[moduleIndex] || topics[1];
  return `${lessonNum} ${list[lessonIndex - 1]}`;
}

function generateLessonContent(subject: string, courseTitle: string, moduleTitle: string, lessonTitle: string, index: number): string {
  let lang = 'javascript';
  if (subject === 'Python' || subject === 'AI/ML' || subject === 'Data Science') lang = 'python';
  else if (subject === 'SQL') lang = 'sql';
  else if (subject === 'HTML') lang = 'html';
  else if (subject === 'CSS') lang = 'css';
  else if (subject === 'C++') lang = 'cpp';
  else if (subject === 'C') lang = 'c';
  else if (subject === 'Java') lang = 'java';
  else if (subject === 'C#') lang = 'csharp';
  else if (subject === 'PHP') lang = 'php';
  else if (subject === 'Go') lang = 'go';
  else if (subject === 'Rust') lang = 'rust';
  else if (subject === 'Kotlin') lang = 'kotlin';
  else if (subject === 'Swift') lang = 'swift';
  else if (subject === 'Bash') lang = 'bash';

  let code = '';
  if (lang === 'javascript') {
    code = `// ${lessonTitle}\n// Sab Technologies Roadmap\n\nconsole.log("Starting Lesson: ${lessonTitle}");\n\nlet topicActive = true;\nlet lessonRank = ${index};\n\nif (topicActive) {\n    console.log("Sabaq " + lessonRank + " bilkul live chal rha hai!");\n    console.log("LeetMaster is coaching you step-by-step!");\n}\n`;
  } else if (lang === 'python') {
    code = `# ${lessonTitle}\n# Sab Technologies Roadmap\n\nprint("Starting Lesson: ${lessonTitle}")\n\ntopic_active = True\nlesson_rank = ${index}\n\nif topic_active:\n    print(f"Sabaq {lesson_rank} bilkul live chal rha hai!")\n    print("LeetMaster is coaching you step-by-step!")\n`;
  } else if (lang === 'sql') {
    code = `-- ${lessonTitle}\n-- Sab Technologies Database Tutorial\n\nSELECT 'Welcome to ${lessonTitle}' AS introduction;\n\n-- Dummy table simulation query\nSELECT * FROM courses_record WHERE lesson_id = ${index};\n`;
  } else if (lang === 'html') {
    code = `<!-- ${lessonTitle} -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>${lessonTitle}</title>\n  <style>\n    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #faf9f6; padding: 20px; }\n    h1 { color: #ff6b2b; }\n  </style>\n</head>\n<body>\n  <h1>Welcome to ${lessonTitle}</h1>\n  <p>Practice HTML elements in the Live Preview stage!</p>\n</body>\n</html>\n`;
  } else if (lang === 'css') {
    code = `/* ${lessonTitle} styles */\n\nbody {\n  background-color: #faf9f6;\n  font-family: 'Plus Jakarta Sans', sans-serif;\n  color: #221f1d;\n}\n\n.course-lesson-header {\n  color: #ff6b2b;\n  font-size: 24px;\n  font-weight: 900;\n}\n`;
  } else if (lang === 'cpp') {
    code = `// ${lessonTitle}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Starting Lesson: ${lessonTitle}" << endl;\n    cout << "Sabaq number " << ${index} << " is loaded!" << endl;\n    return 0;\n}\n`;
  } else if (lang === 'c') {
    code = `// ${lessonTitle}\n#include <stdio.h>\n\nint main() {\n    printf("Starting Lesson: ${lessonTitle}\\n");\n    printf("Sabaq number %d is loaded!\\n", ${index});\n    return 0;\n}\n`;
  } else if (lang === 'java') {
    code = `// ${lessonTitle}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Starting Lesson: ${lessonTitle}");\n        System.out.println("Sabaq number " + ${index} + " is loaded!");\n    }\n}\n`;
  } else if (lang === 'csharp') {
    code = `// ${lessonTitle}\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Starting Lesson: ${lessonTitle}");\n        Console.WriteLine("Sabaq number " + ${index} + " is loaded!");\n    }\n}\n`;
  } else if (lang === 'php') {
    code = `<?php\n// ${lessonTitle}\n\necho "Starting Lesson: ${lessonTitle}\\n";\necho "Sabaq number " . ${index} . " is loaded!\\n";\n`;
  } else if (lang === 'go') {
    code = `// ${lessonTitle}\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Starting Lesson: ${lessonTitle}")\n    fmt.Printf("Sabaq number %d is loaded!\\n", ${index})\n}\n`;
  } else if (lang === 'rust') {
    code = `// ${lessonTitle}\nfn main() {\n    println!("Starting Lesson: ${lessonTitle}");\n    println!("Sabaq number {} is loaded!", ${index});\n}\n`;
  } else {
    code = `// ${lessonTitle}\n// Sab Technologies Roadmap\nconsole.log("Starting Lesson: ${lessonTitle}");\n`;
  }

  return `### ${lessonTitle} Tutorial

Is lesson mein hum **${lessonTitle}** ke baare mein theory aur code concepts ko detail mein cover karenge. Yeh lecture hamari comprehensive roadmap ka hissa hai jis ka maqsad aap ko basic se lekar industry-level execution tak seekhana hai.

### 🌟 Core Theory (بنیادی اصول)
1. **Introduction & Importance**: Modern software development mein high-quality architecture design karne ke liye ye concept nihayat zaroori hai.
2. **Key Parameters**: Is topic ko samajhne ke liye variables, structures, aur design principles ka coordinate hona zaroori hai.
3. **Best Practice Guidance**: Hamesha code ko clean aur commented rakhein taake maintenance aasan ho.

### 💻 Code Example (عملی کوڈ)
Niche diye gaye code snippet ko dekhein aur is ke logic ko samjhein. Aap is code ko copy karke browser ke live Code Sandbox mein run aur test bhi kar sakte hain!

\`\`\`${lang}
${code}\`\`\`

### 🎯 Interactive AI Help (اے آئی ٹیوٹر madad)
Agar aap is topic ki mazeed **Roman-Urdu** ya detail mein line-by-line explanation, real-world examples, aur interview questions chahte hain, to tab par click karke **AI Tutor (Gemini)** se fori guidance haasil karein!`;
}

export const INITIAL_COURSES: Course[] = RAW_INITIAL_COURSES.map((course, cIdx) => {
  const subject = getCourseSubject(course.title);
  
  let originalModules: CourseModule[] = [];

  if (cIdx >= 0 && cIdx <= 44) {
    // Course 1 to 45: generate exactly 30 topics (3 modules * 10 lessons)
    for (let mIdx = 1; mIdx <= 3; mIdx++) {
      const modTitle = getModuleTitle(course.title, mIdx);
      const lessons: Lesson[] = [];
      
      for (let lIdx = 1; lIdx <= 10; lIdx++) {
        const lessonSeq = (mIdx - 1) * 10 + lIdx;
        const lessonTitle = getLessonTitle(subject, mIdx, lIdx);
        const lessonId = `${course.id}-m${mIdx}-l${lIdx}`;
        
        // Find if we have an existing lesson in RAW_INITIAL_COURSES
        const allOriginalLessons = (course.modules || []).flatMap(m => m && m.lessons ? m.lessons : []);
        const existingLesson = allOriginalLessons[lessonSeq - 1];
        
        if (existingLesson) {
          lessons.push({
            id: lessonId,
            title: existingLesson.title,
            duration: existingLesson.duration || `${30 + (lessonSeq % 3) * 15}m`,
            completed: !!existingLesson.completed,
            type: existingLesson.type || (lessonSeq % 2 === 0 ? 'coding' : 'video'),
            content: existingLesson.content || generateLessonContent(subject, course.title, modTitle, lessonTitle, lessonSeq)
          });
        } else {
          const content = generateLessonContent(subject, course.title, modTitle, lessonTitle, lessonSeq);
          lessons.push({
            id: lessonId,
            title: lessonTitle,
            duration: `${30 + (lessonSeq % 3) * 15}m`,
            completed: false,
            type: lessonSeq % 2 === 0 ? 'coding' : 'video',
            content: content
          });
        }
      }
      
      originalModules.push({
        id: `${course.id}-mod-${mIdx}`,
        title: modTitle,
        duration: '5 hrs',
        lessons: lessons
      });
    }
  } else {
    // Other courses: use predefined modules
    originalModules = (course.modules || []).map((mod, mIdx) => {
      const lessons = (mod.lessons || []).map((lesson, lIdx) => {
        const lessonSeq = (mIdx * 10) + lIdx + 1;
        const lessonId = lesson.id || `${course.id}-m${mIdx + 1}-l${lIdx + 1}`;
        const content = lesson.content || generateLessonContent(subject, course.title, mod.title || `Module ${mIdx + 1}`, lesson.title, lessonSeq);
        
        return {
          id: lessonId,
          title: lesson.title,
          duration: lesson.duration || `${30 + (lessonSeq % 3) * 15}m`,
          completed: !!lesson.completed,
          type: lesson.type || (lessonSeq % 2 === 0 ? 'coding' : 'video'),
          content: content
        };
      });
      
      return {
        id: mod.id || `${course.id}-mod-${mIdx + 1}`,
        title: mod.title || `Module ${mIdx + 1}`,
        duration: mod.duration || '5 hrs',
        lessons: lessons
      };
    });
  }

  return {
    ...course,
    instructor: 'LeetMaster',
    instructorTitle: 'Sab Technologies Coach',
    duration: (cIdx >= 0 && cIdx <= 44) ? '15 hrs' : (course.duration || '10 hrs'),
    modules: originalModules,
    progress: course.progress || 0
  };
});

