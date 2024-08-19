import * as Realm from 'realm-web';
const GoogleAuth = () => {
    Realm.handleAuthRedirect();
    return (
        <div>
            <h1>GoogleAuth</h1>
        </div>
    );
}
export default GoogleAuth;