import {
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Tag,
  TagLeftIcon,
  Text,
  CardFooter,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Chat, PaintBrush } from "@carbon/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useConvoPageStore } from "./hooks/useConvoPage";
import { Convo } from "./hooks/useConvo";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useConvoPageStore((state) => state.currentPage);
  const convos = useConvoPageStore((state) => state.convos);
  const fetchPage = useConvoPageStore((state) => state.fetchPage);

  useEffect(() => {
    let searchPage = searchParams.get("page");
    fetchPage(searchPage !== null ? parseInt(searchPage) : 1);
  }, []);

  const countGens = (convo: Convo) => {
    let count = 0;
    for (const [_, value] of Object.entries(convo.mapping)) {
      if (typeof value.content === "object" && "size" in value.content) {
        if (value.content.prompts) {
          count += value.content.prompts.length;
        } else {
          count++;
        }
      }
    }
    return count;
  };

  return (
    <>
      <Container maxW="container.xl" w="100%">
        <Flex as="nav" w={"100%"} alignItems={"center"} pt={3}>
          <Image src="/logo.svg" alt="logo" w={8} h={8} mr={3} />
          <Heading
            as="h1"
            size="lg"
            fontWeight={300}
            sx={{ fontStretch: "125%" }}
          >
            vox dei
          </Heading>
        </Flex>
        <Heading
          as="h2"
          fontSize="4xl"
          mt={8}
          fontWeight={500}
          sx={{ fontStretch: "125%" }}
        >
          Conversations
        </Heading>
        <Flex my={4} alignItems={"center"}>
          <Button
            variant="outline"
            onClick={() => {
              let newPageNum = Math.max(currentPage ? currentPage - 1 : 1, 1);
              setSearchParams({ page: newPageNum.toString() });
              fetchPage(newPageNum);
            }}
            mr={2}
          >
            Previous Page
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              let newPageNum = Math.max(currentPage ? currentPage + 1 : 1, 1);
              setSearchParams({ page: newPageNum.toString() });
              fetchPage(newPageNum);
            }}
          >
            Next Page
          </Button>
          <Spacer />
          <Text fontSize={"large"}>Page {currentPage}</Text>
        </Flex>
        <SimpleGrid columns={4} spacing={4} mb={6}>
          {convos.map((convo, k) => (
            <Card key={k} size="sm">
              <CardHeader>
                <Heading as="h3" fontSize="lg" fontWeight={500}>
                  <Link to={`/convos/${convo.id}`}>{convo.title}</Link>
                </Heading>
              </CardHeader>
              <CardFooter>
                <Flex>
                  <Tag
                    colorScheme={
                      convo.metadata.edit_status === "complete"
                        ? "green"
                        : convo.metadata.edit_status === "in_progress"
                          ? "blue"
                          : "yellow"
                    }
                    textTransform={"uppercase"}
                    mr={2}
                  >
                    {convo.metadata.edit_status}
                  </Tag>
                  <Tag mr={2}>
                    <TagLeftIcon as={Chat} />
                    {`${Object.keys(convo.mapping).length}`}
                  </Tag>
                  <Tag>
                    <TagLeftIcon as={PaintBrush} />
                    {`${countGens(convo)}`}
                  </Tag>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export default App;
