import { Flex, Text, IconButton, Button } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./Card";
import { Trash, Edit2, ElementPlus } from "iconsax-react";

export default function KanbanLane({
  title,
  items,
  onDelete,
  onEdit,
  onEditColumn,
  onNewTask,
  onDeleteColumn,
}) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  return (
    <Flex
      flex="1"
      padding="5"
      w={"30vw"}
      minW={"30vw"}
      flexShrink={0}
      h={"80vh"}
      flexDirection="column"
      minH="10rem"
    >
      <Flex justifyContent={"space-between"} mb={2}>
        <Text fontWeight="bold">{title}</Text>
        <Flex gap={2}>
          {/* <Button onClick={onNewTask} colorScheme="gray">
            New Task
          </Button> */}
          <Button
            p={1}
            size={"md"}
            colorScheme="teal"
            gap={2}
            onClick={(e) => {
              e.stopPropagation();
              onNewTask();
            }}
          >
            <ElementPlus color="#fff" />
            New
          </Button>
          <IconButton
            p={0}
            size={"md"}
            colorScheme="blue"
            icon={<Edit2 color="#fff" />}
            onClick={(e) => {
              e.stopPropagation();
              const ans = prompt("Enter a new title");
              if (ans) {
                onEditColumn(title, ans);
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
                onDeleteColumn(title);
              }
            }}
          />
        </Flex>
      </Flex>
      <Flex
        ref={setNodeRef}
        borderRadius="8"
        background={"gray.600"}
        flex="1"
        padding="2"
        flexDirection="column"
      >
        {items?.map(({ title: cardTitle }, key) => (
          <KanbanCard
            title={cardTitle}
            onEdit={onEdit}
            key={key}
            onDelete={onDelete}
            index={key}
            parent={title}
          />
        ))}
      </Flex>
      <div></div>
    </Flex>
  );
}
