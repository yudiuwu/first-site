public class Main {
    public static void main(String[] args) {

        // Criar conta com saldo inicial
        ContaBancaria conta = new ContaBancaria(100);

        // Consultar saldo
        System.out.println("Saldo inicial: " + conta.getSaldo());

        // Depositar valor
        conta.depositar(50);
        System.out.println("Após depósito: " + conta.getSaldo());

        // Sacar valor
        conta.sacar(30);
        System.out.println("Após saque: " + conta.getSaldo());

        // Testar saque com saldo insuficiente
        try {
            conta.sacar(200);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }

        // Saldo final
        System.out.println("Saldo final: " + conta.getSaldo());
    }
}