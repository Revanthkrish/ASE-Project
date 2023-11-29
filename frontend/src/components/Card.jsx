import { Flex, Text, IconButton, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Trash, Edit2 } from "iconsax-react";

export const KanbanCard = ({ title, index, parent, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      index,
      parent,
    },
    disabled: false,
    attributes: {
      role: "div",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Flex
      padding="3"
      margin="2"
      alignItems={"center"}
      borderRadius="8"
      background={"gray.500"}
      transform={style.transform}
      justifyContent={"space-between"}
    >
      <Box
        {...listeners}
        p={2}
        style={{ cursor: "grab" }}
        {...attributes}
        ref={setNodeRef}
      >
        ::
      </Box>
      <Text overflow={"hidden"}>{title}</Text>
      <Flex gap={2}>
        <IconButton
          p={0}
          size={"md"}
          colorScheme="blue"
          icon={<Edit2 color="#fff" />}
          onClick={(e) => {
            e.stopPropagation();
            const ans = prompt("Enter a new title");
            if (ans) {
              onEdit(parent, title, ans);
            }
          }}
        />
        <IconButton
          p={0}
          size={"md"}
          colorScheme="red"
          icon={<Trash color="#fff" />}
          onClick={(e) => {
            e.stopPropagation();
            const ans = confirm("Are you sure you want to delete this task?");
            if (ans) {
              onDelete(parent, title);
            }
          }}
        />
      </Flex>
    </Flex>
  );
};
