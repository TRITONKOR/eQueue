import { Button } from "@heroui/button";

interface Group {
    Description: string;
    GroupId: number;
    GroupGuid: string;
    isActive: number;
}

interface GroupItemProps {
    group: Group;
    onPress: (group: Group) => void;
}

export const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => {
    const handleClick = () => {
        onPress(group);
    };

    return (
        <Button
            className="w-full text-base sm:text-xl tracking-tight text-center px-6 py-6 h-auto min-h-20 whitespace-normal break-words max-w-full"
            color="primary"
            onPress={handleClick}
        >
            {group.Description}
        </Button>
    );
};
