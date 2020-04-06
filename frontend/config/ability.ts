import { AbilityBuilder } from '@casl/ability';

function subjectName(item: any) {
    if (!item || typeof item === 'string') {
        return item;
    }
    return item.__type;
}

function getAdmins() {
    return ['w.project.portal3@gmail.com', 'vidyakin111.sergey@gmail.com']
}

export default AbilityBuilder.define( {subjectName}, (can: any) => {
    //can(['crud'], 'User', { accessEmail: 'w.project.portal3@gmail.com' });
    can(['crud'], 'Admin', { accessEmail: { $in: getAdmins() }});
});
// w.project.portal3@gmail.com
