import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, Switch, useColorMode } from "@chakra-ui/react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10StoryIds = storyIds.slice(0, 10);

        const storyPromises = top10StoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
      } catch (error) {
        console.error("Failed to fetch top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container centerContent maxW="container.md" py={4}>
      <VStack spacing={4} width="100%">
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Hacker News Top Stories</Text>
          <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </Box>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredStories.map((story) => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="xl" fontWeight="bold">
              {story.title}
            </Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;