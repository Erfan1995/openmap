import {  useState } from 'react';
import { ThemeProvider } from "@magiclabs/ui";
import { UserContext } from 'lib/UserContext';
import CallbackComponent from 'components/client/magic/callback';

const Callback = () => {
  const [user, setUser] = useState({ user: null });

  return (

    <ThemeProvider root>
      <UserContext.Provider value={[user, setUser]}>
        <CallbackComponent />
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default Callback;
