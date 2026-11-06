import { useDeployToProduction } from '@/sanity/hooks/useDeployToProduction';
import { RocketIcon } from '@sanity/icons/Rocket';
import { Box, Button, Card, Flex } from '@sanity/ui';
import { useToast } from '@sanity/ui/toast';
import type { NavbarProps } from 'sanity';

const NAVBAR_HOST_CLASS = 'deploy-to-production-navbar';

export default function DeployToProductionNavbar(props: NavbarProps) {
  const toast = useToast();
  const { deploy, isLoading } = useDeployToProduction();

  const handleDeploy = async () => {
    const result = await deploy();

    if (result.ok) {
      toast.push({
        status: 'success',
        title: 'Mise en production',
        description: result.message,
      });
      return;
    }

    if (result.message === 'Déploiement annulé.') return;

    toast.push({
      status: 'error',
      title: 'Échec du déploiement',
      description: result.message,
    });
  };

  return (
    <Card padding={0} sizing="border" borderBottom>
      <style>{`
        .${NAVBAR_HOST_CLASS} [data-ui="Navbar"] {
          border-bottom: none !important;
        }
      `}</style>
      <Flex align="stretch">
        <Box className={NAVBAR_HOST_CLASS} flex={1}>
          {props.renderDefault(props)}
        </Box>
        <Flex align="center" flex="none" paddingLeft={2} paddingRight={3}>
          <Button
            disabled={isLoading}
            fontSize={1}
            icon={RocketIcon}
            loading={isLoading}
            mode="default"
            padding={3}
            text="Mettre en production"
            tone="positive"
            onClick={handleDeploy}
          />
        </Flex>
      </Flex>
    </Card>
  );
}
