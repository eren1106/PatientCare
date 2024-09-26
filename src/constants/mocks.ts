import { DailyPatientExercise, Exercise, PatientExercise } from "@/interfaces/exercise";

export const MOCK_PATIENT_ID = "clxr5b60g000214nuqvj27lxo";
export const MOCK_DOCTOR_ID = "clxr5b62c000314nuxh3boir4";

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "1",
    exerciseCategoryId: "1",
    thumbnailUrl: "https://cdn.flintrehab.com/uploads/2022/05/man-doing-home-sci-workouts.jpg",
    title: "Shoulder Rotator Cuff Stretch",
    description: "Stretching exercises for the rotator cuff to improve shoulder flexibility and reduce pain.",
    duration: 15,
    difficulty: 'EASY',
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis at nisl eu mollis. Integer eget suscipit metus, vel hendrerit neque. Etiam sodales, elit nec volutpat blandit, lectus nulla vulputate justo, ac pellentesque felis nisl quis augue. Integer sed purus egestas, condimentum mauris sed, porta justo. Duis pellentesque arcu eu.",
    videoUrl: "https://www.youtube.com/watch?v=150O8tNdRj0",
    createdDatetime: new Date("2023-03-15"),
    updatedDatetime: new Date("2023-03-15")
  },
  {
    id: "2",
    exerciseCategoryId: "2",
    thumbnailUrl: "https://cdn.flintrehab.com/uploads/2022/05/man-doing-home-sci-workouts.jpg",
    title: "Ankle Alphabet Exercise",
    description: "Range of motion exercise for the ankle joint to improve mobility and stability.",
    duration: 10,
    difficulty: 'MEDIUM',
    videoUrl: "https://www.youtube.com/watch?v=S4H_rZA2kSM",
    createdDatetime: new Date("2023-04-20"),
    updatedDatetime: new Date("2023-04-20")
  },
  {
    id: "3",
    exerciseCategoryId: "3",
    thumbnailUrl: "https://cdn.flintrehab.com/uploads/2022/05/man-doing-home-sci-workouts.jpg",
    title: "Knee Strengthening Exercises",
    description: "Strengthening exercises for the knee muscles to support and stabilize the knee joint.",
    duration: 20,
    difficulty: 'HARD',
    videoUrl: "https://www.youtube.com/watch?v=YMytSEYr2yU",
    createdDatetime: new Date("2023-05-10"),
    updatedDatetime: new Date("2023-05-10")
  },
  {
    id: "4",
    exerciseCategoryId: "4",
    thumbnailUrl: "https://cdn.flintrehab.com/uploads/2022/05/man-doing-home-sci-workouts.jpg",
    title: "Lower Back Stretching Routine",
    description: "Gentle stretching exercises to relieve tension and improve flexibility in the lower back.",
    duration: 15,
    difficulty: 'EASY',
    videoUrl: "https://www.youtube.com/watch?v=gcX4qN--Zdo",
    createdDatetime: new Date("2023-06-05"),
    updatedDatetime: new Date("2023-06-05")
  },
  {
    id: "5",
    exerciseCategoryId: "5",
    thumbnailUrl: "https://cdn.flintrehab.com/uploads/2022/05/man-doing-home-sci-workouts.jpg",
    title: "Hip Flexor Strengthening",
    description: "Exercises to strengthen the hip flexor muscles for improved hip stability and function.",
    duration: 25,
    difficulty: 'MEDIUM',
    videoUrl: "https://www.youtube.com/watch?v=mO8YJAxVG2M",
    createdDatetime: new Date("2023-07-15"),
    updatedDatetime: new Date("2023-07-15")
  },
];

export const MOCK_PATIENT_EXERCISES: PatientExercise[] = [
  {
    id: "1",
    exercise: MOCK_EXERCISES[0],
    sets: 3,
    createdDatetime: new Date("2024-06-01"),
  },
  {
    id: "2",
    exercise: MOCK_EXERCISES[1],
    sets: 2,
    createdDatetime: new Date("2024-06-01"),
  },
  {
    id: "3",
    exercise: MOCK_EXERCISES[2],
    sets: 4,
    createdDatetime: new Date("2024-06-01"),
  },
  {
    id: "4",
    exercise: MOCK_EXERCISES[3],
    sets: 1,
    createdDatetime: new Date("2024-06-01"),
  },
  {
    id: "5",
    exercise: MOCK_EXERCISES[4],
    sets: 3,
    createdDatetime: new Date("2024-06-01"),
  },
];

export const MOCK_DAILY_PATIENT_EXERCISES: DailyPatientExercise[] = [
  {
    id: "1",
    patientId: "1",
    isCompleted: false,
    createdDatetime: new Date("2024-06-01"),
    patientExercise: MOCK_PATIENT_EXERCISES[0],
  },
  {
    id: "2",
    patientId: "1",
    isCompleted: true,
    createdDatetime: new Date("2024-06-01"),
    completedDatetime: new Date(),
    patientExercise: MOCK_PATIENT_EXERCISES[0],
  },
  {
    id: "3",
    patientId: "1",
    isCompleted: false,
    createdDatetime: new Date("2024-06-01"),
    patientExercise: MOCK_PATIENT_EXERCISES[0],
  },
  {
    id: "4",
    patientId: "1",
    isCompleted: true,
    createdDatetime: new Date("2024-06-01"),
    completedDatetime: new Date(),
    patientExercise: MOCK_PATIENT_EXERCISES[0],
  },
  {
    id: "5",
    patientId: "1",
    isCompleted: false,
    createdDatetime: new Date("2024-06-01"),
    patientExercise: MOCK_PATIENT_EXERCISES[0],
  },
];

// export const MOCK_PATIENT_LIST: Patient[] = [
//   {
//     id: "1",
//     patient: "James Johnson",
//     contactNumber: "+60112345781",
//     email: "jamesjohnson123@gmail.com",
//     upcomingAppointments: "No Appointments",
//     dateCreated: "Dec 14, 2021",
//   },
//   {
//     id: "2",
//     patient: "Sarah Williams",
//     contactNumber: "+60112345782",
//     email: "sarahwilliams456@gmail.com",
//     upcomingAppointments: "May 20, 2024",
//     dateCreated: "Jan 10, 2022",
//   },
//   {
//     id: "3",
//     patient: "Zheng Wu Bang",
//     contactNumber: "+60112345782",
//     email: "wbzheng@gmail.com",
//     upcomingAppointments: "May 20, 2024",
//     dateCreated: "Jan 10, 2022",
//   },
//   {
//     id: "4",
//     patient: "Kuek Zi Lii",
//     contactNumber: "+60112345782",
//     email: "eren@gmail.com",
//     upcomingAppointments: "May 20, 2024",
//     dateCreated: "Jan 10, 2022",
//   },
//   {
//     id: "5",
//     patient: "Chee Zing",
//     contactNumber: "+60112345782",
//     email: "nasuha456@gmail.com",
//     upcomingAppointments: "May 20, 2024",
//     dateCreated: "Jan 10, 2022",
//   },
//   {
//     id: "6",
//     patient: "Nur Nasuha",
//     contactNumber: "+60112345782",
//     email: "sarahwilliams456@gmail.com",
//     upcomingAppointments: "May 20, 2024",
//     dateCreated: "Jan 10, 2022",
//   },
// ]

// export const MOCK_QUESTIONNAIRE: Questionnaire = {
//   title: "Knee Injury and Osteoarthritis Outcome Score (KOOS)",
//   description: "The Knee Injury and Osteoarthritis Outcome Score (KOOS) is a questionnaire designed to assess short and long-term patient-relevant outcomes following knee injury. The KOOS is self-administered and assesses five outcomes: pain, symptoms, activities of daily living, sport and recreation function, and knee-related quality of life. The KOOS meets basic criteria of outcome measures and can be used to evaluate the course of knee injury and treatment outcome. KOOS is patient-administered, the format is user-friendly and it takes about 10 minutes to fill out.",
//   questions: [
//     {
//       id: 1,
//       text: "How often is your knee painful?",
//       options: [
//         { id: 1, text: "Never" },
//         { id: 2, text: "Monthly" },
//         { id: 3, text: "Weekly" },
//         { id: 4, text: "Daily" },
//         { id: 5, text: "Always" }
//       ]
//     },
//     {
//       id: 2,
//       text: "What degree of pain have you experienced the last week when twisting/pivoting on your knee?",
//       options: [
//         { id: 1, text: "None" },
//         { id: 2, text: "Mild" },
//         { id: 3, text: "Modeate" },
//         { id: 4, text: "Severe" },
//         { id: 5, text: "Extreme" }
//       ]
//     },
//     {
//       id: 3,
//       text: "What degree of pain have you experienced the last week when twisting/pivoting on your knee?",
//       options: [
//         { id: 1, text: "None" },
//         { id: 2, text: "Mild" },
//         { id: 3, text: "Modeate" },
//         { id: 4, text: "Severe" },
//         { id: 5, text: "Extreme" }
//       ]
//     },
//     {
//       id: 4,
//       text: "What degree of pain have you experienced the last week when straightening knee fully?",
//       options: [
//         { id: 1, text: "None" },
//         { id: 2, text: "Mild" },
//         { id: 3, text: "Modeate" },
//         { id: 4, text: "Severe" },
//         { id: 5, text: "Extreme" }
//       ]
//     },
//     {
//       id: 5,
//       text: "What degree of pain have you experienced the last week when walking on flat surface?",
//       options: [
//         { id: 1, text: "None" },
//         { id: 2, text: "Mild" },
//         { id: 3, text: "Modeate" },
//         { id: 4, text: "Severe" },
//         { id: 5, text: "Extreme" }
//       ]
//     }
//   ]
// };

export const MOCK_PATIENT_IMAGE_PATH = "/images/patient_img.jpg";
export const MOCK_DOCTOR_IMAGE_PATH = "/images/doctor_img.jpg";


// Chat Related Data

export const Users: User[] = [
  {
      id: 1,
      avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
      messages: [],
      name: 'Jane Doe',
  },
  {
      id: 2,
      avatar: 'https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350',
      messages: [],
      name: 'John Doe',
  },
  {
      id: 3,
      avatar: 'https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350',
      messages: [],
      name: 'Elizabeth Smith',
  },
  {
      id: 4,
      avatar: 'https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350',
      messages: [],
      name: 'John Smith',
  },
  {
      id: 5,
      avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
      messages: [],
      name: 'Jakob Hoeg',
  }
];


export const userData: User[] = [
  {
      id: 1,
      avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
      messages: [
          {
              id: 1,
              avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
              name: 'Jane Doe',
              message: 'Hey, Jakob',
              timestamp: '10:00 AM',
          },
          {
              id: 2,
              avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
              name: 'Jakob Hoeg',
              message: 'Hey!',
              timestamp: '10:01 AM',
          },
          {
              id: 3,
              avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
              name: 'Jane Doe',
              message: 'How are you?',
              timestamp: '10:02 AM',
          },
          {
              id: 4,
              avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
              name: 'Jakob Hoeg',
              message: 'I am good, you?',
              timestamp: '10:03 AM',
          },
          {
              id: 5,
              avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
              name: 'Jane Doe',
              message: 'I am good too!',
              timestamp: '10:04 AM',
          },
          {
              id: 6,
              avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
              name: 'Jakob Hoeg',
              message: 'That is good to hear!',
              timestamp: '10:05 AM',
          },
          {
              id: 7,
              avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
              name: 'Jane Doe',
              message: 'How has your day been so far?',
              timestamp: '10:06 AM',
          },
          {
              id: 8,
              avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
              name: 'Jakob Hoeg',
              message: 'It has been good. I went for a run this morning and then had a nice breakfast. How about you?',
              timestamp: '10:10 AM',
          },
          {
              id: 9,
              avatar: 'https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350',
              name: 'Jane Doe',
              isLoading: true
          }
      ],
      name: 'Jane Doe',
  },
  {
      id: 2,
      avatar: 'https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350',
      name: 'John Doe',
      messages: []
  },
  {
      id: 3,
      avatar: 'https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350',
      name: 'Elizabeth Smith',
      messages: []
  },
  {
      id: 4,
      avatar: 'https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350',
      name: 'John Smith',
      messages: []
  }
];

export const ChatBotMessages: Message[] = [
  {
      id: 1,
      avatar: '/chatbot.svg',
      name: 'ChatBot',
      message: 'Hello! How can I help you today?',
      timestamp: '10:00 AM',
      role: 'ai',
  },
  {
      id: 2,
      avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
      name: 'Jakob Hoeg',
      message: 'I need help with my order',
      timestamp: '10:01 AM',
      role: 'user',
  },
  {
      id: 3,
      avatar: '/chatbot.svg',
      name: 'ChatBot',
      message: 'Sure! Please provide me with your order number',
      timestamp: '10:02 AM',
      role: 'ai',
  },
  {
      id: 4,
      avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
      name: 'Jakob Hoeg',
      message: '123456',
      timestamp: '10:03 AM',
      role: 'user',
  },
  {
      id: 5,
      avatar: '/chatbot.svg',
      name: 'ChatBot',
      message: 'Thank you! One moment please while I look up your order',
      timestamp: '10:04 AM',
      role: 'ai',
  },
  {
      id: 6,
      avatar: '/chatbot.svg',
      name: 'ChatBot',
      message: 'I have found your order. It is currently being processed and will be shipped out soon.',
      timestamp: '10:05 AM',
      role: 'ai',
  },
  {
      id: 7,
      avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
      name: 'Jakob Hoeg',
      message: 'Thank you for your help!',
      timestamp: '10:06 AM',
      role: 'user',
  },
  {
      id: 8,
      avatar: '/chatbot.svg',
      name: 'ChatBot',
      message: 'You are welcome! Have a great day!',
      isLoading: true,
      timestamp: '10:10 AM',
      role: 'ai',
  }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
  id: 5,
  avatar: 'https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4',
  name: 'Jakob Hoeg',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
  id: number;
  avatar: string;
  name: string;
  message?: string;
  isLoading?: boolean;
  timestamp?: string;
  role?: string;
}

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}