import { AbilityBuilder } from '@casl/ability';
function subjectName(item: any) {
    if (!item || typeof item === "string") {
        return item;
    }

    return item.__type;
}
export default AbilityBuilder.define( {subjectName}, (can: any) => {
    can(['crud'], 'User', { accessEmail: 'w.project.portal3@gmail.com' });
});
// w.project.portal3@gmail.com