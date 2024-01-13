import {
  Box,
  Container,
  Divider,
  Flex,
  Icon,
  Image,
  Heading,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  StackDivider,
  Tag,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { Convo as IConvo, useConvoStore } from "../hooks/useConvo";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Time } from "@carbon/icons-react";
import Message from "../components/Message";

export default function Convo() {
  const { convoId } = useParams<{ convoId: string }>();
  const convo = useConvoStore((state) => state.convo);
  const readConvo = useConvoStore((state) => state.readConvo);
  const saveConvo = useConvoStore((state) => state.saveConvo);

  const messages = convo ? Object.entries(convo?.mapping).reverse() : [];

  // Initial load
  useEffect(() => {
    if (convoId) {
      readConvo(convoId);
    }
  }, [convoId]);

  /* TODO: Refactor out header to separate component if I get a 3rd page */
  return (
    <Container maxW="container.xl" w="100%">
      <Flex as="nav" w={"100%"} alignItems={"center"} pt={3}>
        <Link to="/">
          <Image src="/logo.svg" alt="logo" w={8} h={8} mr={3} />
        </Link>
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
        {convo?.title || "Loading"}
      </Heading>
      <Flex pt={4} pb={8}>
        <Tag
          colorScheme={
            convo?.metadata.edit_status == "complete" ? "green" : "yellow"
          }
          mr={2}
          textTransform={"uppercase"}
        >
          {convo?.metadata.edit_status}
        </Tag>
        <Tag mr={2}>
          <TagLeftIcon as={Time} />
          {convo?.create_time
            ? new Date(convo.create_time * 1000).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "2-digit",
              }) +
              " " +
              new Date(convo.create_time * 1000).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "???"}
        </Tag>
        <Spacer />
        <RadioGroup
          value={convo?.metadata.edit_status}
          onChange={(edit_status) =>
            saveConvo(
              convoId || "",
              convo
                ? { ...convo, metadata: { ...convo.metadata, edit_status } }
                : convo,
            )
          }
        >
          <Stack direction="row">
            <Radio value="todo">To Do</Radio>
            <Radio value="in_progress">In Progress</Radio>
            <Radio value="complete">Complete</Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      <Divider />
      <Stack spacing={6} mt={4} mb={12}>
        {messages.map((message, k) => (
          <Message message_id={message[0]} message={message[1]} key={k} />
        ))}
      </Stack>
    </Container>
  );
}
