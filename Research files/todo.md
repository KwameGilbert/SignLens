ULL PROJECT UPGRADE PLAN: UNIVERSAL DATASET RECORDER SYSTEM

This upgrade will add a powerful dataset recording subsystem capable of:

✔ Collecting data from webcam
✔ Extracting data from pre-recorded videos & images
✔ Supporting static (A–Z) and dynamic (words, gestures) signs
✔ Offering 3 control modes
✔ Allowing 3 class-naming methods
✔ Supporting customizable sequence lengths
✔ Giving you selection menus before starting
✔ Being fully driven by config OR manual input

This turns your project into a complete dataset creation toolkit suitable for:

Sign Language Recognition

Action Recognition

Gesture AI Training

Skeleton-based ML datasets

📌 WHAT I WILL BUILD (DETAILED)
1️⃣ A Unified Dataset Recorder Interface

When you launch the dataset recorder, you will first see a menu interface that asks:

Step 1 — Choose Recording Mode

Keyboard Mode

Press r = start recording

Press s = stop and save

Press n = next class

Automatic Timer Mode

Choose countdown: e.g., 3 seconds

Choose number of frames: e.g., 30

Recorder automatically starts & stops

You keep hands visible; no keyboard needed

Hybrid Mode

Countdown happens (3 seconds etc.)

Auto-record starts

BUT you can still press s or n at any time

Best for dynamic gestures

You choose one from the menu before starting.

2️⃣ Class Naming Options

You will get a second selection:

Step 2 — Choose Class Source

Predefined List

A–Z alphabet

Common signs: hello, thanks, love, yes, no

Customizable in config

Type Label Manually

The program asks: “Enter class name:”

You type: “hello” or “thanks” or “walk”

Load Labels From File

A text file like:

A
B
C
hello
thanks
stay


The recorder loads them automatically

At the start, you choose which method you want.

3️⃣ Static vs Dynamic Mode

Before recording begins, you will choose:

Step 3 — Type of Gesture

Static (Alphabet / single-frame gestures)

Dynamic (words / multi-frame gestures)

The system will automatically:

Use static length (default 3 frames)

Use dynamic length (default 45 frames)

But…

4️⃣ Customizable Sequence Length

In your config.yaml:

sequence_lengths:
  static_default: 3
  dynamic_default: 45
  static_custom: null
  dynamic_custom: null


You will be able to:

Use defaults (3 & 45)

OR enter custom values via menu

OR modify config file to permanent custom values

Recorder will dynamically adjust.

5️⃣ Dataset Recorder Modules

I’ll implement 2 major recorder modules:

Module A — LiveRecorder (Webcam)

Features:

Multi-mode control

Class selection

Automatic folder creation

Auto-incremented sequence numbering

Save .npy sequences

FPS display

UI overlays (“Recording…”, “Get ready…”)

Sound or text beeps for countdown

Module B — VideoRecorder

Features:

Load a folder of videos

Extract keypoints per frame

Split into sequences

Save them neatly in class folders

Handle variable frame rates

Optional frame skipping

Auto-detect static/dynamic

6️⃣ Folder Output Format

Example structure:

dataset/
    A/
       seq_001.npy
       seq_002.npy
    B/
       seq_001.npy
    hello/
       seq_001.npy
       seq_002.npy
    thanks/
       seq_001.npy


Each .npy:

Contains 3 frames (static)
or

Contains 30–60 frames (dynamic)

Each frame is your full keypoint vector of:

face 468 × 3

pose 33 × 4

hands 21 × 3 × 2

Total: 1662 values per frame

7️⃣ User Interface Flow (Interactive Menu)

When starting dataset recorder:

---------------------------------------
 DATASET RECORDER
---------------------------------------

Choose Recording Mode:
1. Keyboard Control
2. Automatic Timer
3. Hybrid
Selection: _


Then:

Choose Class Naming Method:
1. Predefined list (A–Z, hello, etc.)
2. Enter class name manually
3. Load labels from text file
Selection: _


Then:

Static or Dynamic Gesture?
1. Static (A–Z)
2. Dynamic (words/actions)
Selection: _


Then:

Use default sequence length 45?
Or enter custom?
1. Default
2. Custom
Selection: _


Then recorder starts.

8️⃣ Integration With Current System

The recorder will:

Use your HolisticDetector class

Use your keypoint extraction module

Use your logger

Respect your config.yaml settings

Display UI overlays (FPS, status, class name, recording status)

🧩 TO-DO LIST (WHAT I WILL IMPLEMENT)
A) Build the Unified Control Menu

interactive menu system

keyboard input

mode selection logic

class selection logic

load class lists from file

static/dynamic mode selection

B) Build LiveRecorder

webcam streaming

3 recording modes

countdown timer logic

sequence saving

overlays UI indicators

logging integration

FPS tracking

saving .npy sequences into folders

C) Build VideoRecorder

video frame extraction

mediapipe detection per frame

sequence generation

handling static/dynamic differences

saving sequences

support for image sequences

D) Add Config Options

default/static/dynamic lengths

class lists

timer defaults

save paths

options for skipping UI

E) Add Logger Integration

events like:

“New sequence saved”

“Recording started”

“Countdown started”

“Video file processed”

“Loaded class list”

F) Testing + Debugging

test all three modes

ensure class folders auto-created

ensure errors handled cleanly

check frame consistency

📌 LAST STEP — CONFIRMATION

If you approve this plan, I will continue with:

PART 1: Code for the Menu + Config updates

THEN

PART 2: LiveRecorder (Webcam)

THEN

PART 3: VideoRecorder

THEN

PART 4: Final integration + documentation