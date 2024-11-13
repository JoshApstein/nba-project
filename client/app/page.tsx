"use client";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  useQuery,
  QueryClient,
  useQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Key, useState } from "react";

const queryClient = new QueryClient({});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

function Page() {
  const { data = [] } = useQuery<{ id: Key; name: string }[]>({
    queryKey: ["teams"],
    queryFn: () =>
      fetch("http://localhost:3001/teams").then((res) => res.json()),
  });
  const items = data;

  const [selected, setSelected] = useState<{ id: Key; name: string }>();

  return (
    <div>
      <main className="">
        <div>
          <TeamDropDown items={items} setSelected={setSelected} />
        </div>
        <div style={{ marginLeft: "200px" }}>
          {selected && <DraftRounds id={selected.id} name={selected.name} />}
        </div>
      </main>
    </div>
  );
}
interface DraftRoundsProps {
  id: Key;
  name: string;
}

function DraftRounds(props: DraftRoundsProps) {
  const { data } = useQuery({
    queryKey: [props.id],
    queryFn: () =>
      fetch(`http://localhost:3001/draftPicks/${props.id}`).then((res) =>
        res.json()
      ),
  });

  return (
    <div>
      {data && (
        <div>
          <p>Team: {props.name}</p>
          DraftRoundPicks:
          <p>Round 1: {data.one}</p>
          <p>Round 2: {data.two}</p>
          <p> None: {data.none}</p>
        </div>
      )}
    </div>
  );
}

interface DropDownProps {
  setSelected: (arg: any) => void;
  items: { id: Key; name: string }[];
}

function TeamDropDown(props: DropDownProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" disabled={!props.items}>
          Teams
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        className="max-h-[50vh] overflow-y-auto"
        items={props.items}
        onAction={(key) => {
          console.log(key);
          props.setSelected({
            id: key,
            name: props.items?.find((i) => key == i.id)?.name || "",
          });
        }}
      >
        {(item) => (
          <DropdownItem key={item.id as number} color={"default"}>
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
