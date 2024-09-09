import {Admins} from "@bikairproject/lib-manager";

export default interface AdminWithRoles extends Admins {
    roles: string[]
}
