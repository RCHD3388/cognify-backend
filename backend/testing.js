const text = `Okay, here's a learning path for an intermediate Frontend developer, with 5 steps as requested:
main description : This learning path is designed to enhance your existing Frontend skills and introduce you to advanced concepts and best practices. It will focus on modern JavaScript frameworks, state management solutions, and testing methodologies. Upon completion, you'll be equipped to build more complex and maintainable web applications.
path 1 :
title : Advanced JavaScript Concepts & ESNext Features
description : Dive deeper into JavaScript concepts such as closures, prototypal inheritance, and the event loop. Explore modern ESNext features like decorators, optional chaining, and nullish coalescing. Practice applying these concepts through coding challenges and small projects. Use resources like MDN Web Docs and ESNext specification documents for reference.
time : 2 Weeks
path 2 :
title : Mastering React Component Patterns & Performance Optimization
description : Explore advanced React component patterns such as Higher-Order Components (HOCs), Render Props, and Compound Components. Learn techniques for optimizing React performance including memoization, code splitting, and lazy loading. Implement these strategies in a real-world project to solidify your understanding. Consult the official React documentation and performance profiling tools.
time : 3 Weeks
path 3 :
title : Advanced State Management with Redux or Zustand
description : Delve into advanced state management solutions using Redux with Redux Toolkit or Zustand for simpler solutions. Learn about middleware, selectors, and asynchronous actions. Implement complex state logic within a React application. Refer to the official Redux documentation or Zustand's documentation for in-depth explanations.
time : 2 Weeks
path 4 :
title : Testing Methodologies & Frameworks (Jest & React Testing Library)
description : Master testing best practices with frameworks like Jest and React Testing Library. Learn to write unit tests, integration tests, and end-to-end tests for React components. Understand the importance of code coverage and continuous integration. Practice testing components thoroughly, referencing Jest's documentation and React Testing Library's guides.
time : 2 Weeks
path 5 :
title : Building a Complex Frontend Project with Best Practices
description : Apply all the knowledge you've gained to build a comprehensive Frontend project. Focus on code organization, maintainability, and performance. Incorporate testing, state management, and advanced component patterns. This project will serve as a portfolio piece showcasing your expertise, consider making it open source to share with the community.
time : 4 Weeks
end_of_path`;

function parseLearningPath(text) {
  const result = {};

  // Extract main description
  const mainDescMatch = text.match(/main description\s*:\s*(.+?)\s*path 1\s*:/s);
  result.main_description = mainDescMatch ? mainDescMatch[1].trim() : "";

  // Extract all paths
  const pathRegex = /path (\d+) :\s*title\s*:\s*(.+?)\s*description\s*:\s*(.+?)\s*time\s*:\s*(.+?)(?=path \d+ :|end_of_path)/gs;

  const paths = [];
  let match;
  while ((match = pathRegex.exec(text)) !== null) {
    paths.push({
      path: Number(match[1]),
      title: match[2].trim(),
      description: match[3].trim(),
      time: match[4].trim(),
    });
  }

  result.paths = paths;
  return result;
}

const parsed = parseLearningPath(text);
console.log(parsed);
