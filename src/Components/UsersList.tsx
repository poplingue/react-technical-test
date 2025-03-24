import { FormControl, FormLabel, List, ListItem, ListItemButton, ListItemDecorator } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import { useGlobalContext } from "../Context/GlobalContext";
import { useEffect, useState } from "react";

interface UserColor {
  [key: string]: string;
}

const UsersList = () => {
  const [randomColors, setRandomColors] = useState<UserColor>({});
  const {
    state: { users },
    toggleActiveUser,
  } = useGlobalContext();

  useEffect(() => {
    const obj: UserColor = {};

    // Manage random color of person icon
    if (users.length !== Object.keys(randomColors).length) {
      users.map(({ id }) => {
        obj[id] = "#" + Math.floor(Math.random() * 16777215).toString(16);
      });

      setRandomColors(obj);
    }
  }, [randomColors, users]);
  const handleUserSelect = (userId: string) => {
    toggleActiveUser(userId)
  };

  return (
    users && (
      <FormControl>
        <FormLabel>Users</FormLabel>
        <List>
          {users.map((user: User) => {
              return (
                <ListItem>
                  <ListItemButton selected={user.active} onClick={() => handleUserSelect(user.id)}>
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
