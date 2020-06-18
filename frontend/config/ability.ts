import { AbilityBuilder, Ability, defineAbility } from '@casl/ability';

function getAdmins() {
    return ['w.project.portal3@gmail.com', 'vidyakin111.sergey@gmail.com']
}

function getSuperAdmins() {
    return ['w.project.portal3@gmail.com']
}

/* ** Version 3
function subjectName(item: any) {
    if (!item || typeof item === 'string') {
        return item;
    }
    return item.__type;
}

export default AbilityBuilder.define({ subjectName }, (can: any) => {
    can(['crud'], 'Admin', { accessEmail: { $in: getAdmins() } });
    can(['manage'], 'Client', { accessEmail: { $in: getSuperAdmins() } });
});
*/

export default function defineAbilityFor(user: any) {

    return defineAbility(can => {
        // superadmin
        if (getSuperAdmins().includes(user.email)) {
            can('manage', 'Client')
            can('manage', 'ClientData')
        } else
            // admin of company
            if (user.roles.includes('admin')) {
                can('manage', 'ClientData') // all admin's data - structure, employees etc.
            }
            // other employees
            else {
                can('read', 'Groups')
                can('read', 'Posts')
                // TODO: add manage rights for own objects
            }
    })
}