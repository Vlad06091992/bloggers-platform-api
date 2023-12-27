import { RootDBType } from "../src/types";

export const db: RootDBType = {
  videos: [
    {
      title: "new video",
      id: 1,
      author: "author",
      minAgeRestriction: null,
      canBeDownloaded: true,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: ["P144"],
    },
    {
      title: "new video2",
      id: 2,
      author: "author2",
      minAgeRestriction: null,
      canBeDownloaded: true,
      createdAt: new Date().toDateString(),
      publicationDate: new Date().toDateString(),
      availableResolutions: ["P360"],
    },
  ],
  blogs: [
    {
      id: "1",
      name: "Tech Blog",
      description: "A blog about technology and gadgets",
      websiteUrl: "https://example.com/tech-blog",
      createdAt: new Date().toDateString(),
      isMembership: true,
    },
    {
      id: "2",
      name: "Travel Adventures",
      description: "Exploring the world, one adventure at a time",
      websiteUrl: "https://example.com/travel-adventures",
      createdAt: new Date().toDateString(),
      isMembership: true,
    },
    {
      id: "3",
      name: "Cooking Creations",
      description: "Delicious recipes and culinary experiments",
      websiteUrl: "https://example.com/cooking-creations",
      createdAt: new Date().toDateString(),
      isMembership: true,
    },
    {
      id: "4",
      name: "Fashion Forward",
      description: "The latest trends and style inspiration",
      websiteUrl: "https://example.com/fashion-forward",
      createdAt: new Date().toDateString(),
      isMembership: true,
    },
    {
      id: "5",
      name: "Fitness Fanatics",
      description: "Get fit and stay healthy with our tips",
      websiteUrl: "https://example.com/fitness-fanatics",
      createdAt: new Date().toDateString(),
      isMembership: true,
    },
  ],
  posts: [
    {
      id: "1",
      title: "Introduction to JavaScript",
      shortDescription: "A brief introduction to JavaScript programming",
      content: "JavaScript is a versatile programming language...",
      blogId: "1",
      blogName: "Tech Blog",
      createdAt: "hz",
    },
    {
      id: "2",
      title: "Exploring Europe's Hidden Gems",
      shortDescription:
        "Discover the beauty of lesser-known European destinations",
      content: "Europe offers a wealth of hidden gems for travelers...",
      blogId: "2",
      createdAt: "hz",
      blogName: "Travel Adventures",
    },
    {
      id: "3",
      title: "Delicious Chocolate Cake Recipe",
      shortDescription: "Learn how to make a mouthwatering chocolate cake",
      content:
        "Indulge in the rich and decadent flavors of this chocolate cake...",
      blogId: "3",
      blogName: "Cooking Creations",
      createdAt: "hz",
    },
    {
      id: "4",
      title: "Latest Fashion Trends for Fall",
      shortDescription: "Stay stylish with the latest fashion trends this fall",
      content: "Discover the hottest fashion trends for the autumn season...",
      blogId: "4",
      blogName: "Fashion Forward",
      createdAt: "hz",
    },
    {
      id: "5",
      title: "Effective Workout Routine for Beginners",
      shortDescription:
        "Start your fitness journey with this beginner's workout routine",
      content:
        "Get in shape and build a healthy fitness foundation with these exercises...",
      blogId: "5",
      createdAt: "hz",
      blogName: "Fitness Fanatics",
    },
  ],
};
