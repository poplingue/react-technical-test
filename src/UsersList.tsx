import { FormControl, FormLabel } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import PersonIcon from "@mui/icons-material/Person";
import { useGlobalContext } from "./GlobalContext";
import { useEffect, useState } from "react";

interface UserColor {
  [key: string]: string;
}

const UsersList = () => {
  const [randomColors, setRandomColors] = useState<UserColor>({});
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const {
    state: { users },
  } = useGlobalContext();

  useEffect(() => {
    const obj: UserColor = {};

    if (users.length !== Object.keys(randomColors).length) {
      users.map(({ id }) => {
        obj[id] = "#" + Math.floor(Math.random() * 16777215).toString(16);
      });

      setRandomColors(obj);
    }
  }, [randomColors, users]);
  const handleUserSelect = (userId: string) => {
    const newActiveStates: User[] = activeUsers.flatMap((user: User) =>
      user.id === userId ? { ...user, id: userId } : [],
    );
    setActiveUsers(newActiveStates);
  };

  return (
    users && (
      <FormControl>
        <FormLabel>Users</FormLabel>
        <List>
          {users &&
            users.map((user: User) => {
              return (
                <ListItem>
                  <ListItemButton onClick={() => handleUserSelect(user.id)}>
                    <ListItemDecorator>
                      <PersonIcon style={{ color: randomColors[user.id] }} />
                    </ListItemDecorator>
                    {user.login}
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </FormControl>
    )
  );
};

export default UsersList;
