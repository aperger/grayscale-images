import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export class DialogHelper {

    static readonly OK = 'OK';
    static readonly POSITION_TOP = 'top';

    public static showMessage(
        snackBar: MatSnackBar,
        msg: string,
        isError?: boolean,
        action?: string,
        duration?: number
    ): MatSnackBarRef<SimpleSnackBar> {
        if (!action) {
            action = this.OK;
        }
        if (!duration && (duration !== 0)) {
            duration = 5000;
        }

        const config: MatSnackBarConfig<any> = {
            verticalPosition: this.POSITION_TOP
        };
        if (duration > 0) {
            config.duration = duration;
        }
        if (isError === true) {
            config.panelClass = ['message-box', 'error'];
        } else {
            config.panelClass = ['message-box', 'success'];
        }

        return snackBar.open(msg, action, config);
    }
}
