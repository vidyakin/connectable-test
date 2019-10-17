import { AbilityBuilder } from '@casl/ability';
function subjectName(item) {
    if (!item || typeof item === "string") {
        return item;
    }

    return item.__type;
}
export default AbilityBuilder.define( {subjectName}, can => {
    can(['crud'], 'User', { accessEmail: 'kostiantyn.lebedynskiy@gmail.com' });
});