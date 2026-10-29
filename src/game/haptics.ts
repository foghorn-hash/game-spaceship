import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Mobile Haptic feedback utility supporting both Capacitor native & Web Vibration API
 */
class HapticFeedback {
  private isEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public async tap() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }

  public async shot() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(8);
      }
    }
  }

  public async damage() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 40, 40]);
      }
    }
  }

  public async explosion() {
    if (!this.isEnabled) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 50, 120]);
      }
    }
  }
}

export const haptic = new HapticFeedback();
