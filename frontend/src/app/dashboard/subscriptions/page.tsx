
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layout as SubscriptionModule } from '@/lib/modules/subscriptions/components/Layout';

export default function SubscriptionsPage() {
    return (
        <DashboardLayout>
            <SubscriptionModule />
        </DashboardLayout>
    );
}
