// Default Memories Data & Storyline Content for Levels 1-9
import level1_slide1 from '../assets/memories/level1_slide1.jpg';
import level1_slide2 from '../assets/memories/level1_slide2.jpg';
import level1_slide3 from '../assets/memories/level1_slide3.jpg';

import level2_slide1 from '../assets/memories/level2_slide1.jpg';
import level2_slide2 from '../assets/memories/level2_slide2.jpg';
import level2_slide3 from '../assets/memories/level2_slide3.jpg';

import starry_beach from '../assets/memories/starry_beach.png';
import sunset_picnic from '../assets/memories/sunset_picnic.png';
import first_date from '../assets/memories/first_date.png';
import birthday_cake from '../assets/memories/birthday_cake.png';

export const INITIAL_LETTER = `Miss Violina Ray, yeah that name really suits u better HEHEHEHE! 💖

Well My Highness Happy Birthday! Happy birthday to the person who made me realise over the past 2 and a half years who I truly am and all...

Over all those like dozens of fights we had together hehehe, I still love you and always will be loving you more and more!

To me, You are the best thing that I could ever have in my life—more expensive than anything, more valuable than any person. You are the cosmic attractor of my life, dragging me towards you across all time and space. ✨

Happy birthday my highness, and please accept this as a small token of my love and gratitude towards you! 🎂💖✨`;

export const DEFAULT_MEMORIES = [
  {
    id: 1,
    title: "Level 1: THE FIRST TEXT: MATHS EXAM",
    subtitle: "March 8th, 2024 - The Spark ☕✨",
    targetScore: 500,
    maxMoves: 18,
    requiredType: "heart",
    requiredCount: 10,
    unlocked: true,
    slides: [
      {
        id: "1-1",
        type: "image",
        url: level1_slide1,
        caption: "The sweet smile that started it all! ☕💖",
        date: "April 5, 2024",
        mood: "Nervous & Enchanted"
      },
      {
        id: "1-2",
        type: "image",
        url: level1_slide2,
        caption: "Goru Bihu matashree vibes & hilarious turmeric face mask! 😂🌾❤️",
        date: "April 13, 2024",
        mood: "Playful & Hilarious"
      },
      {
        id: "1-3",
        type: "image",
        url: level1_slide3,
        caption: "Everyone is busy doing Bihu photoshoot... Me bihu khaba jai asu! 😎✨",
        date: "April 13, 2024",
        mood: "Gorgeous & Festive"
      }
    ]
  },
  {
    id: 2,
    title: "Level 2: OUR FIRST MEET : AWKWARD PHOTOS and MOM'S KITCHEN",
    subtitle: "First Awkward Photos & Sweet Memories 📸✨",
    targetScore: 600,
    maxMoves: 18,
    requiredType: "star",
    requiredCount: 12,
    unlocked: true,
    slides: [
      {
        id: "2-1",
        type: "image",
        url: level2_slide1,
        caption: "Rockstar ninja vibes in the yellow smiley mask! 😎💛🤘",
        date: "January 9, 2024",
        mood: "Super Playful & Cool"
      },
      {
        id: "2-2",
        type: "image",
        url: level2_slide2,
        caption: "Miss Violina Das - Official cutest profile of 06-03-2024! 🌸📄💖",
        date: "March 6, 2024",
        mood: "Adorable & Official"
      },
      {
        id: "2-3",
        type: "image",
        url: level2_slide3,
        caption: "Good Vibes Only cafe moment with the sweetest smile! ☕✨💜",
        date: "May 2, 2024",
        mood: "Warm & Enchanting"
      }
    ]
  },
  {
    id: 3,
    title: "Level 3: OUR FIRST HUG : MOMENTOS AND MOMENTS",
    subtitle: "Holding You Tight & Timeless Moments 🫂✨",
    targetScore: 700,
    maxMoves: 20,
    requiredType: "cupcake",
    requiredCount: 14,
    unlocked: true,
    slides: [
      {
        id: "3-1",
        type: "image",
        url: starry_beach,
        caption: "Our very first hug that made time freeze completely 🫂❤️",
        date: "May 2024",
        mood: "Heartwarming"
      }
    ]
  },
  {
    id: 4,
    title: "Level 4: MOM'S KITCHEN : THIS WAS SPECIAL",
    subtitle: "Special Meals & Warm Cozy Kitchen Talks 🍳✨",
    targetScore: 800,
    maxMoves: 20,
    requiredType: "rose",
    requiredCount: 15,
    unlocked: true,
    slides: [
      {
        id: "4-1",
        type: "image",
        url: sunset_picnic,
        caption: "Cooking together in Mom's kitchen... this was truly special 🍲💖",
        date: "June 2024",
        mood: "Cozy & Loving"
      }
    ]
  },
  {
    id: 5,
    title: "Level 5: MEETING AT STARBUCKS: FIRST GUWAHATI MEETUP",
    subtitle: "Coffee Dates & Guwahati Travels ☕🏙️",
    targetScore: 1000,
    maxMoves: 22,
    requiredType: "heart",
    requiredCount: 16,
    unlocked: true,
    slides: [
      {
        id: "5-1",
        type: "image",
        url: first_date,
        caption: "Our first Guwahati Starbucks date sipping coffee together ☕✨",
        date: "August 2024",
        mood: "Coffee Bliss"
      }
    ]
  },
  {
    id: 6,
    title: "Level 6: MY ANGRY BIRD AND ME AT NEHRU PARK",
    subtitle: "Park Strolls & Cute Fights 🦜🌳",
    targetScore: 1200,
    maxMoves: 22,
    requiredType: "star",
    requiredCount: 17,
    unlocked: true,
    slides: [
      {
        id: "6-1",
        type: "image",
        url: sunset_picnic,
        caption: "My cute Angry Bird arguing with me under the trees at Nehru Park 🌳❤️",
        date: "October 2024",
        mood: "Playful & Silly"
      }
    ]
  },
  {
    id: 7,
    title: "Level 7: DIGHOLI PUKHURI: FIRST KISS",
    subtitle: "Lakeside Sunset & First Kiss 💋✨",
    targetScore: 1400,
    maxMoves: 24,
    requiredType: "rose",
    requiredCount: 18,
    unlocked: true,
    slides: [
      {
        id: "7-1",
        type: "image",
        url: starry_beach,
        caption: "That unforgettable first kiss by Digholi Pukhuri lake 💋🌊",
        date: "December 2024",
        mood: "Pure Romance"
      }
    ]
  },
  {
    id: 8,
    title: "Level 8: MY BIRTHDAY : THANK YOU FOR THE GIFT!",
    subtitle: "Gifts, Gratitude & Pure Happiness 🎁✨",
    targetScore: 1600,
    maxMoves: 25,
    requiredType: "cupcake",
    requiredCount: 20,
    unlocked: true,
    slides: [
      {
        id: "8-1",
        type: "image",
        url: first_date,
        caption: "My birthday made so special because of your wonderful gift & love 🎁💖",
        date: "2025",
        mood: "Grateful & Loved"
      }
    ]
  },
  {
    id: 9,
    title: "Level 9: Grand Birthday Celebration",
    subtitle: "Happy Birthday Miss Violina Ray! 🎂🎉💖",
    puzzleImage: birthday_cake,
    unlocked: true,
    slides: [
      {
        id: "9-1",
        type: "image",
        url: birthday_cake,
        caption: "Happy Birthday to the cosmic attractor of my life! 🎂🎆",
        date: "September 23, 2026",
        mood: "Celebration of Love"
      }
    ]
  }
];
