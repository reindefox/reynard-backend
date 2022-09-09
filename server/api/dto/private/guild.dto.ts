export class GuildDto {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: bigint;
    features: string[];
    permissions_new: string;
    withBot?: boolean;
}
