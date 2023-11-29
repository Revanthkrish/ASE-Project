import { DndContext, rectIntersection } from "@dnd-kit/core";
import KanbanLane from "./Column";
import { Flex, Box, Input, Button, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import { LogoutCurve } from "iconsax-react";
import { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

export default function KanbanBoard() {
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState(["ToDo", "In Progress", "Done"]);
  const [email] = useLocalStorage("userEmail", null);
  const[userName]=useLocalStorage("userName",null);
  const [id, setId] = useState(nanoid());
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const addNewCard = (title) => {
    setItems([...items, { title, pIndex: 0 }]);
  };

  const getKanban = async () => {
    try {
      if (!email) {
        alert("Please login to view kanban board");
        navigate("/");
        return;
      }
      const data = await axios.get(
        "http://localhost:8080/api/v1/getKanbanBoard/?email=" + email
      );
      const { items: _items } = data.data?.[0] || {};
      setId(data.data?.[0]?.id || nanoid());
      setColumns(data.data?.[0]?.columns || ["ToDo", "In Progress", "Done"]);
      console.log(_items?.map((e) => e?.split("*")?.[1]));
      const transformed =
        _items?.map((e) => ({
          title: e?.split("*")?.[0],
          pIndex: parseInt(e?.split("*")?.[1]),
        })) || [];
      console.log(transformed);
      setItems(transformed);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKanban();
  }, []);

  const addNewColumn = () => {
    const title = prompt("Enter a new column name");
    if (title) {
      setColumns((p) => [...p, title]);
    }
  };

  const addNewPopCard = (pIndex) => {
    const task = prompt("Enter a new task");
    if (task) {
      setItems([...items, { title: task, pIndex }]);
    }
  };

  const saveKanban = async () => {
    try {
      const data = {
        id,
        userEmail: email,
        name: "Kanban Board",
        description: "This is a kanban board",
        items: items?.map((e) => e.title + "*" + e.pIndex) || [],
        columns,
      };
      await axios.post("http://localhost:8080/api/v1/createKanbanBoard/", data);
      alert("Kanban board saved");
    } catch (error) {
      console.log(error);
      alert("Error saving kanban board");
    }
  };

  const editCard = (parent, old, title) => {
    const index = items.findIndex((item) => item.title === old);
    const pIndex = columns.indexOf(parent);
    setItems([
      ...items.slice(0, index),
      { title, pIndex },
      ...items.slice(index + 1),
    ]);
  };

  const deleteCard = (parent, title) => {
    const index = items.findIndex((item) => item.title === title);
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  };

  return (
    <Box w={"screen"} h={"screen"}>
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={(e) => {
          const container = e.over?.id;
          const title = e.active.data.current?.title ?? "";
          const index = items.findIndex((item) => item.title === title);
          const pIndex = columns.indexOf(container);
          console.log({
            title,
            index,
            pIndex,
          });
          setItems([
            ...items.slice(0, index),
            { title, pIndex },
            ...items.slice(index + 1),
          ]);
        }}
      >
        <Flex flexDirection="column">
          <Flex w="full" p={2} gap={2}>
            <h2
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                marginRight: "auto",
              }}
            >
              My Kanban Board {userName}{" "}
            </h2>
            <Flex gap={2}>
              <Button
                colorScheme="teal"
                onClick={() => {
                  saveKanban();
                }}
              >
                Save
              </Button>
              <IconButton
                aria-label="Search database"
                icon={<LogoutCurve />}
                onClick={() => {
                  window.localStorage.removeItem("userEmail");
                  location.replace("/");
                }}
              />
            </Flex>
          </Flex>
          {/* <AddCard addCard={addNewCard} /> */}
          <Flex flexDirection="row" flexShrink={0} overflowX="scroll" flex={1}>
            {columns?.map((title, key) => (
              <KanbanLane
                title={title}
                onNewTask={() => addNewPopCard(key)}
                items={items?.filter((item) => item.pIndex === key)}
                key={key}
                onEditColumn={(oldTitle, newTitle) => {
                  setColumns([
                    ...columns.slice(0, columns.indexOf(oldTitle)),
                    newTitle,
                    ...columns.slice(columns.indexOf(oldTitle) + 1),
                  ]);
                }}
                onDeleteColumn={(oldTitle) => {
                  // do card Index shifting as the column is deleted and index is changed
                  const pIndex = columns.indexOf(oldTitle);
                  setItems(
                    items.map((item) => {
                      if (item.pIndex > pIndex) {
                        return { ...item, pIndex: item.pIndex - 1 };
                      }
                      // if the item is in the column to be deleted, shift it to the previous column
                      if (item.pIndex === pIndex) {
                        // if there is no previous column, shift it to the next column
                        if (pIndex === 0 && columns.length > 1) {
                          return { ...item, pIndex: item.pIndex + 1 };
                        }
                        return { ...item, pIndex: item.pIndex - 1 };
                      }
                      return item;
                    })
                  );

                  setColumns([
                    ...columns.slice(0, columns.indexOf(oldTitle)),
                    ...columns.slice(columns.indexOf(oldTitle) + 1),
                  ]);
                }}
                onDelete={deleteCard}
                onEdit={editCard}
              />
            ))}
            <Button
              colorScheme="blue"
              variant="outline"
              w={"25vw"}
              mt={10}
              mx={2}
              flexShrink={0}
              onClick={() => {
                addNewColumn();
              }}
            >
              Add Column
            </Button>
          </Flex>
        </Flex>
      </DndContext>
    </Box>
  );
}
